import dayjs from "dayjs";
import React, { useState } from "react";
import history from '../../redux/configStore';
import { useDispatch } from "react-redux";
import MonthPicker from "../MonthPicker/MonthPicker";
import {
  CloseBtn,
  ContBody,
  ContHeader,
  ContTitle,
  ContWrap,
  Editdesc,
  EditHeader,
  InitMoneyInput,
  MoneyWrap,
  MonthWrap,
  ResultEditWrap,
  Won,
  ErrorText,
  TestEditBtn,
  RebalanceWrap,
  RebalanceInputWrap,
  RebalanceCont,
  RebalanceSelect,
  SelectItem,
  PickerWrap,
} from "./style";
import close_btn from "../../assets/images/close_btn.svg";
import { actionCreators as testformActions } from "../../redux/modules/testform";
import { actionCreators as portActions } from "../../redux/modules/port";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import RebalanceInfo from "../RebalanceInfo/RebalanceInfo";

const MySwal = withReactContent(Swal);

const ResultEdit = (props) => {
  const dispatch = useDispatch();

  const start_date = props.start_date;
  const end_date = props.end_date;
  const rebalance_month = props.rebalance_month;

  const [rebalance, setRebalance] = useState(
    rebalance_month === 0 ? 
      "없음" :
        rebalance_month === 1 ? 
        "1 개월" :
          rebalance_month === 3 ? 
          "3 개월" :
            rebalance_month === 6 ? 
            "6 개월" : 0
  );
  const [open_select, setOpenSelect] = useState(false);

  const [init_money, setInitMoney] = useState("");
  const [check_money, setCheckMoney] = useState(true);

  const change_Money = (e) => {
    const num_reg = /\d/;

    if (!num_reg.test(e.target.value) && e.target.value !== "") {
      e.target.value = "";
      MySwal.fire({
        title: "숫자만 입력해주세요.",
        confirmButtonColor: '#0075FF',
      });
      return;
    }
    setInitMoney(e.target.value);

    if (e.target.value < 100 || e.target.value > 100000) {
      setCheckMoney(false);
    } else {
      setCheckMoney(true);
    }
    dispatch(testformActions.setMoney(e.target.value));
  };

  const click_select = (value) => {
    setRebalance(value)
    setOpenSelect(false);
  }

  return (
    <ResultEditWrap>
      <ContWrap>
        <CloseBtn
          src={close_btn}
          alt="close-btn"
          onClick={() => {
            props.setCheckEdit(false);
          }}
        />
        <ContHeader>
          <EditHeader>실험 정보 수정</EditHeader>
          <Editdesc>정보 수정은 실험기간과 금액만 수정이 가능해요</Editdesc>
        </ContHeader>
        <ContBody>
          <PickerWrap>
            <MonthWrap>
              <ContTitle>실험 시작</ContTitle>
              <MonthPicker
                type="edit_start"
                edit_year={Number(dayjs(start_date).format("YYYY"))}
                edit_month={Number(dayjs(start_date).format("MM"))}
                />
            </MonthWrap>
            <MonthWrap>
              <ContTitle>실험 종료</ContTitle>
              <MonthPicker
                type="edit_end"
                edit_year={Number(dayjs(end_date).format("YYYY"))}
                edit_month={Number(dayjs(end_date).format("MM"))}
              />
            </MonthWrap>
          </PickerWrap>
          <RebalanceInputWrap>
            <ContTitle>리벨런싱 주기</ContTitle>
            <RebalanceWrap
            onClick={() => {
              setOpenSelect(!open_select);
            }}
            >
              <RebalanceCont>{rebalance}</RebalanceCont>
              { open_select &&
                <RebalanceSelect>
                  <SelectItem
                    onClick={() => {
                      click_select("없음")
                      dispatch(testformActions.setRebalance(0));
                    }}
                  >
                    없음
                  </SelectItem>
                  <SelectItem
                    onClick={() => {
                      click_select("1 개월")
                      dispatch(testformActions.setRebalance(1));
                    }}
                  >
                    1 개월
                  </SelectItem>
                  <SelectItem
                    onClick={() => {
                      click_select("3 개월")
                      dispatch(testformActions.setRebalance(3));
                    }}
                  >
                    3 개월
                  </SelectItem>
                  <SelectItem
                    onClick={() => {
                      click_select("6 개월")
                      dispatch(testformActions.setRebalance(6));
                    }}
                  >
                    6 개월
                  </SelectItem>
                </RebalanceSelect>
              }
            </RebalanceWrap>
          </RebalanceInputWrap>
          <ContTitle>실험 금액</ContTitle>
          <MoneyWrap>
            <InitMoneyInput
              type="text"
              placeholder="금액을 입력해 주세요"
              onChange={change_Money}
              value={init_money}
            />
            <Won>만원</Won>
            {!check_money && (
              <ErrorText>
                실험금액은 100만원 이상 100,000만원 이하만 가능해요
              </ErrorText>
            )}
          </MoneyWrap>
        </ContBody>
        <TestEditBtn
          onClick={() => {
            dispatch(portActions.getResultDB());
            props.setCheckEdit(false);
          }}
        >
          수정하기
        </TestEditBtn>
      </ContWrap>
    </ResultEditWrap>
  );
};

export default ResultEdit;