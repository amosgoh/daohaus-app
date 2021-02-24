import React from 'react';
import { Box, Flex, Icon, Image } from '@chakra-ui/react';
import { RiLoginBoxLine } from 'react-icons/ri';
import { Link as RouterLink } from 'react-router-dom';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import MetaChill from '../assets/img/metacartel__avatar.jpg';
import LexDAO from '../assets/img/lex__avatar.png';

const followingDaos = [
  {
    img: MetaChill,
    name: 'MetaCartel',
    tags: ['grants'],
    link: '/dao/0x1/0xee629a192374caf2a72cf1695c485c5c89611ef2',
  },
  {
    img: LexDAO,
    name: 'LexDao',
    tags: ['club'],
    link: '/dao/0x64/0x58234d4bf7a83693dc0815d97189ed7d188f6981',
  },
];

const Following = () => {
  return (
    <>
      <TextBox size='xs' mb={2}>
        Friends
      </TextBox>
      <ContentBox w='40%'>
        {followingDaos.map((dao, i) => (
          <Flex key={dao.name} align='center' justify='space-between' py={4}>
            <Flex align='center'>
              <Image
                src={dao.img}
                alt={dao.name}
                w='50px'
                h='50px'
                mr={4}
                borderRadius='50px'
              />
              <Box>
                <Box fontSize='lg' fontFamily='heading' fontWeight={700} pb={2}>
                  {dao.name}
                </Box>
                <Flex>
                  {dao.tags.map((tag) => (
                    <Box
                      key={dao + '-' + tag}
                      bg='secondary.500'
                      borderRadius={10}
                      p='0 8px'
                    >
                      {tag}
                    </Box>
                  ))}
                </Flex>
              </Box>
            </Flex>
            <RouterLink to={dao.link}>
              <Icon
                as={RiLoginBoxLine}
                color='secondary.500'
                h='25px'
                w='25px'
              />
            </RouterLink>
          </Flex>
          // {i < followingDaos.length - 1 && <Box as='hr' w='80%' m='0 auto' />}
        ))}
      </ContentBox>
    </>
  );
};

export default Following;
