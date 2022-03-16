import React from "react";
import { useDispatch } from "react-redux";
import { history } from '../../redux/configStore';
import PortChart from "../PortChart/PortChart";
import { actionCreators as portActions } from "../../redux/modules/port";
import {
  PortCardWrap,
  CardInfoWrap,
  CardTitle,
  CardInfo,
  CardCheck,
  InfoTop,
  MyBestBtn,
  InfoBottom,
  CardMoney,
  StockInfoWrap,
  StockCircle,
  StockName,
  StockContWrap,
  UnMyBestBtn,
} from "./style";

const PortCard = (props) => {
  const dispatch = useDispatch();

  const port_data = props.port_data.portBacktestingCal;
  const final_money = props.final_money;

  const click_check = (type, port_id) => {
    dispatch(portActions.setCompare(type, port_id));
  };

  const click_card = (port_id) => {
    //dispatch(portActions.getPortOneDB(port_id));
    history.push(`/detail/${port_id}`)
  };

  return (
    <PortCardWrap>
      <CardCheck
        id={props.port_data.portId}
        className="checkbox"
        type="checkbox"
        name={props.port_data.portId}
        value={props.port_data.portId}
        onChange={(e) => {
          click_check(e.target.checked, props.port_data.portId);
        }}
      />
      <label htmlFor={props.port_data.portId}></label>
      <div
        onClick={() => {
          click_card(props.port_data.portId);
        }}
      >
        <PortChart port_data={port_data} />
        <CardInfoWrap>
          <InfoTop>
            <CardTitle>자산실험 {props.num + 1}</CardTitle>
          </InfoTop>
          <InfoBottom>
            <CardInfo>종목 개수: {port_data.stockNames.length}개</CardInfo>
            <StockContWrap>
              {port_data.stockNames.map((n, i) => {
                return (
                  <StockInfoWrap key={i}>
                    <StockCircle />
                    <StockName>{n}</StockName>
                  </StockInfoWrap>
                );
              })}
            </StockContWrap>
            <CardMoney>
              최종 자산: {final_money.toLocaleString("ko-KR")} 만원
            </CardMoney>
          </InfoBottom>
        </CardInfoWrap>
      </div>
      {props.port_data.myBest ? (
        <UnMyBestBtn
          onClick={() => {
            dispatch(portActions.setBestDB(false, props.port_data.portId));
          }}
        >
          자랑하기
        </UnMyBestBtn>
      ) : (
        <MyBestBtn
          onClick={() => {
            dispatch(portActions.setBestDB(true, props.port_data.portId));
          }}
        >
          자랑하기
        </MyBestBtn>
      )}
    </PortCardWrap>
  );
};

export default PortCard;