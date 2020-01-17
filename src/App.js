import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ApolloClient from 'apollo-boost';

import { get } from './utils/Requests';
import Routes from './Routes';
import Header from './components/header/Header';
import Loading from './components/shared/Loading';
import McDaoService from './utils/McDaoService';
import Web3Service from './utils/Web3Service';
// import TokenService from './utils/TokenService';
import { resolvers } from './utils/Resolvers';

import { DaoDataContext, DaoServiceContext } from './contexts/Store';

import './App.scss';

// const web3 = new Web3Service();

const App = ({ client }) => {
  const [loading, setloading] = useState(true);
  const [daoPath, setDaoPath] = useState('');
  const [daoData, setDaoData] = useContext(DaoDataContext);
  const [daoService] = useContext(DaoServiceContext);

  useEffect(() => {
    var pathname = window.location.pathname.split('/');
    const daoParam = pathname[2];

    const getDao = async () => {
      let apiData = '';
      if (!daoParam) {
        setloading(false);
        return false;
      }
      try {
        const daoRes = await get(`moloch/${daoParam}`);
        apiData = daoRes.data;

        if (apiData) {
          setDaoPath(daoParam);
          setDaoData({
            ...apiData,
            legacyClient: apiData.isLegacy
              ? new ApolloClient({
                  uri: apiData.graphNodeUri,
                  clientState: {
                    resolvers,
                  },
                })
              : undefined,
          });
        } else {
          setloading(false);
        }
      } catch (e) {
        setloading(false);
        console.log('error on dao api call', e);
      }
    };

    getDao();
    // eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   const initDao = async () => {
  //     try {
  //       const _mcDao = new McDaoService(daoPath);
  //       await _mcDao.initContract();
  //       setDaoService(_mcDao);
  //     } catch (err) {
  //       console.log('error init contract:', err);
  //     }
  //   };

  //   if (daoPath) {
  //     initDao();
  //   }
  //   // eslint-disable-next-line
  // }, [daoPath]);

  useEffect(() => {
    // save all web3 data to apollo cache
    const fetchData = async () => {
      if (!daoService) {
        client.writeData({
          data: {
            currentPeriod: 0,
            totalShares: 0,
            guildBankAddr: '0x00000000000000000000',
            approvedToken: '0x00000000000000000000',
            tokenSymbol: 'DAO',
            gracePeriodLength: 0,
            votingPeriodLength: 0,
            periodDuration: 0,
            processingReward: 0,
            proposalDeposit: 0,
            guildBankValue: 0,
            shareValue: 0,
          },
        });
        return;
      }

      const currentPeriod = await daoService.mcDao.getCurrentPeriod();
      const totalShares = await daoService.mcDao.getTotalShares();
      const guildBankAddr = await daoService.mcDao.getGuildBankAddr();
      const gracePeriodLength = await daoService.mcDao.getGracePeriodLength();
      const votingPeriodLength = await daoService.mcDao.getVotingPeriodLength();
      const periodDuration = await daoService.mcDao.getPeriodDuration();
      const processingReward = await daoService.mcDao.getProcessingReward();
      const proposalDeposit = await daoService.mcDao.getProposalDeposit();
      const approvedToken = await daoService.mcDao.approvedToken();

      // const tokenService = new TokenService(approvedToken);
      const guildBankValue = await daoService.token.balanceOf(guildBankAddr);
      const tokenSymbol = await daoService.token.getSymbol();

      const cacheData = {
        currentPeriod: parseInt(currentPeriod),
        totalShares: parseInt(totalShares),
        guildBankAddr,
        approvedToken,
        tokenSymbol,
        gracePeriodLength: parseInt(gracePeriodLength),
        votingPeriodLength: parseInt(votingPeriodLength),
        periodDuration: parseInt(periodDuration),
        processingReward: daoService.web3.utils.fromWei(processingReward),
        proposalDeposit: daoService.web3.utils.fromWei(proposalDeposit),
        guildBankValue: daoService.web3.utils.fromWei(guildBankValue),
        // pre web3:
        // shareValue: web3.fromWei(guildBankValue) / totalShares,
        shareValue: parseFloat(
          daoService.web3.utils.fromWei(
            daoService.web3.utils
              .toBN(guildBankValue)
              .div(daoService.web3.utils.toBN(totalShares)),
          ),
        ),
      };

      client.writeData({
        data: cacheData,
      });

      if (daoData.isLegacy) {
        daoData.legacyClient.writeData({
          data: cacheData,
        });
      }

      setloading(false);
    };
    // if (daoService) {
    fetchData();
    // }
  }, [client, daoService, daoData, daoPath]);

  return (
    <div className="App">
      {loading ? (
        <Loading />
      ) : (
        <Router>
          <Header />
          <Routes isValid={!!daoPath} />
        </Router>
      )}
    </div>
  );
};

export default App;
