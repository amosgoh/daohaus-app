import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  Box,
  Flex,
  Select,
  Divider,
} from '@chakra-ui/react';

import { rgba } from 'polished';

import { Link as RouterLink, useParams } from 'react-router-dom';

import { useFormModal, useOverlay } from '../contexts/OverlayContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import TextBox from '../components/TextBox';

import { FORM } from '../data/forms';
import { useMetaData } from '../contexts/MetaDataContext';

// PLAYLISTS.find(list => list.id === 'favorites');

const ProposalSelector = () => {
  const { daoProposals } = useMetaData();
  const { proposalSelector, setProposalSelector } = useOverlay();
  const { openFormModal } = useFormModal();
  const { theme } = useCustomTheme();

  const { playlists, customData } = daoProposals || {};
  const startingList = playlists?.[0];

  const [currentPlaylist, setCurrentPlaylist] = useState(startingList);

  const handleClose = () => {
    setProposalSelector(false);
    setCurrentPlaylist(startingList);
  };

  const selectProposal = id => {
    if (!currentPlaylist) return;
    const selectedForm = FORM[id];
    handleClose();
    openFormModal({ lego: selectedForm });
  };

  const selectPlaylist = id => {
    if (!id || !playlists) return;
    setCurrentPlaylist(playlists.find(list => list.id === id));
  };

  return (
    <Modal isOpen={proposalSelector} onClose={handleClose} isCentered>
      <ModalOverlay bgColor={rgba(theme.colors.background[500], 0.8)} />
      <ModalContent
        rounded='lg'
        bg='blackAlpha.600'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        maxWidth='700px'
        py={3}
        px={9}
      >
        <ModalHeader pb={0}>
          <Flex justify='space-between' align='center' w='90%'>
            <TextBox
              fontFamily='heading'
              textTransform='uppercase'
              fontSize='md'
              fontWeight={700}
              mb={6}
              color='white'
            >
              What would you like to do?
            </TextBox>
          </Flex>
        </ModalHeader>
        <ModalBody
          flexDirection='column'
          display='flex'
          maxH='650px'
          overflowY='auto'
        >
          <PlaylistSelect
            playlists={playlists}
            selectPlaylist={selectPlaylist}
            handleClose={handleClose}
          />
          <ModalCloseButton color='white' />
          {currentPlaylist?.forms?.map(formId => (
            <ProposalOption
              form={FORM[formId]}
              customFormData={customData?.[formId]}
              key={formId}
              selectProposal={selectProposal}
            />
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProposalSelector;

const PlaylistSelect = ({ playlists, selectPlaylist, handleClose }) => {
  const { daochain, daoid } = useParams();
  const handleChange = e => {
    if (!e?.target?.value) return;
    selectPlaylist(e.target.value);
  };
  return (
    <Flex>
      <Select mb={8} width='60%' onChange={handleChange} fontFamily='accessory'>
        {playlists?.map(list => (
          <option key={list.id} value={list.id}>
            {list.name}
          </option>
        ))}
      </Select>
      <RouterLink
        to={`/dao/${daochain}/${daoid}/settings/proposals`}
        onClick={handleClose}
      >
        <TextBox variant='body' color='secondary.500'>
          Manage
        </TextBox>
      </RouterLink>
    </Flex>
  );
};

const ProposalOption = ({ form, selectProposal, customFormData }) => {
  const { title, description, id } = form;
  const handleClick = () => selectProposal(id);
  return (
    <>
      <Flex onClick={handleClick} cursor='pointer'>
        {/* <Image h='70px' minW='70px' mb={6} /> */}
        <Box w='100%'>
          <TextBox
            fontFamily='heading'
            textTransform='uppercase'
            fontSize='md'
            fontWeight={700}
            mb={2}
            color='white'
          >
            {customFormData?.title || title}
          </TextBox>
          <Box fontFamily='body' size='sm' mb={6} color='whiteAlpha.800'>
            {customFormData?.description || description}
          </Box>
        </Box>
      </Flex>
      <Divider mb={6} />
    </>
  );
};