import React from 'react';
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  AreaSeries,
} from 'react-vis';
import { Box } from '@chakra-ui/core';
import { useTheme } from '../../contexts/CustomThemeContext';

const MemberSnapshotChart = () => {
  const [theme] = useTheme();

  const data = [
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 4 },
    { x: 4, y: 3 },
    { x: 5, y: 5 },
    { x: 6, y: 8 },
  ];

  return (
    <Box w='95%' minH='300px'>
      <FlexibleXYPlot>
        <VerticalGridLines color='white' />
        <HorizontalGridLines color='white' />
        <XAxis
          title='Time'
          style={{
            line: { stroke: 'white' },
            ticks: { stroke: 'white' },
            text: { stroke: 'none', fill: 'white', fontWeight: 500 },
            title: { fill: 'white' },
          }}
        />
        <YAxis
          title='Members'
          style={{
            line: { stroke: 'white' },
            ticks: { stroke: 'white' },
            text: { stroke: 'none', fill: 'white', fontWeight: 500 },
            title: { fill: 'white' },
          }}
        />
        <AreaSeries
          curve='curveNatural'
          data={data}
          color={theme.colors.primary[50]}
        />
      </FlexibleXYPlot>
    </Box>
  );
};

export default MemberSnapshotChart;