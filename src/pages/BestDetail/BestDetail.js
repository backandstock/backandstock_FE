import React from 'react';
import { BarChart, CommentList, LineChart, TopInfo } from '../../components';
import StockList from '../../components/Result/StockList';
import { BarChartWrap, BestDetailWrap, CancleBtn, CommentBtn, CommentCnt, CommentInputWrap, CommentWrap, CommnetInput, ContWrap, InfoWrap, LineChartWrap, UserImg } from './style';

import { test_data } from './testData';

const BestDetail = (props) => {
  let result_list = test_data.portBacktestingCal;

  const months = result_list.months;
  const monthYieldMoney = result_list.monthYieldMoney;
  const kospiYieldMoney = result_list.kospiYieldMoney;
  const kosdaqYieldMoney = result_list.kosdaqYieldMoney;

  // 수익률
  const monthYield = result_list.monthYield
  const kospiYield = result_list.kospiYield
  const kosdaqYield = result_list.kosdaqYield

  const data = [
    {
      id: "내 자산",
      color: "hsl(233, 70%, 50%)",
      data: [],
    },
    {
      id: "KOSPI",
      color: "hsl(233, 70%, 50%)",
      data: [],
    },
    {
      id: "KOSDAQ",
      color: "hsl(233, 70%, 50%)",
      data: [],
    },
  ];

  const bar_data = [];

  // 수익금 데이터
  monthYieldMoney.map((m, i) => {
    let xy = {
      x: months[i].substring(2),
      y: parseInt(m / 10000),
    };
    data[0].data.push(xy);
  });

  kospiYieldMoney.map((m, i) => {
    let xy = {
      x: months[i].substring(2),
      y: parseInt(m / 10000),
    };
    data[1].data.push(xy);
  });

  kosdaqYieldMoney.map((m, i) => {
    let xy = {
      x: months[i].substring(2),
      y: parseInt(m / 10000),
    };
    data[2].data.push(xy);
  });

  // 수익률 데이터
  monthYield.map((m, i) => {
    let xy = {
        months: months[i].substring(2),
        "내 자산": Math.floor(monthYield[i]),
        "KOSPI": Math.floor(kospiYield[i]),
        "KOSDAQ": Math.floor(kosdaqYield[i]),
    }
    bar_data.push(xy);
  })

  return (
    <BestDetailWrap>
      <ContWrap>

        <InfoWrap>
          <TopInfo 
            nickname={test_data.nickname}
            type="Best" 
            port_list={test_data.portBacktestingCal}
          />
        </InfoWrap>

        <LineChartWrap>
            <LineChart 
              margin={{
                top: 32, 
                right: 120, 
                bottom: 64, 
                left: 100
              }}
              line_data={data} 
            />
          </LineChartWrap>
          
          <BarChartWrap>
            <BarChart 
              width={880}
              height={300}
              margin={{
                top: 32, 
                right: 120, 
                bottom: 64, 
                left: 100
              }}
              translateX={120}
              translateY={38}
              bar_data={bar_data} 
              tick_font={12}
            />
          </BarChartWrap>
          <StockList {...result_list}></StockList>
      </ContWrap>

      <CommentWrap>
        <CommentCnt>댓글 {test_data.likesCnt}</CommentCnt>
        <CommentInputWrap>
          <UserImg />
          <CommnetInput />
          <CommentBtn>완료</CommentBtn>
          <CancleBtn>취소</CancleBtn>
        </CommentInputWrap>
        <CommentList />
      </CommentWrap>
    </BestDetailWrap>
  );
};

export default BestDetail;