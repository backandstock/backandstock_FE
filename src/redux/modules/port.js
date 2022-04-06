import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { getToken } from '../../shared/token';
import axios from "axios";
import dayjs from "dayjs"
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// actions
const GET_RESULT = "GET_RESULT";
const SAVE_PORTONE = "SAVE_PORTONE";
const GET_PORT = "GET_PORT"
const GET_PORTONE = "GET_PORTONE"
const DELETE_PORT = "DELETE_PORT"
const SET_PORTONE_INIT = "GET_PORTONE_INIT"

const SET_BEST = "SET_BEST";
const SET_COMPARE = "SET_COMPARE";
const GET_COMPARE = "GET_COMPARE";
const SET_INITCOMPARE = "SET_INITCOMPARE";

const CHANGE_COMMNET_CNT = "CHANGE_COMMNET_CNT";

// action creators
const getResult = createAction(GET_RESULT, (test_result) => ({ test_result }));
const savePortOne = createAction(SAVE_PORTONE, (port_id, result) => ({ port_id, result }));
const getPort = createAction(GET_PORT, (port_list) => ({ port_list }));
const getPortOne = createAction(GET_PORTONE, (port) => ({ port }));
const deletePort = createAction(DELETE_PORT, (port_idx, port_id) => ({ port_idx, port_id }));
const setPortOneInit = createAction(SET_PORTONE_INIT, () => ({  }));

const setBest = createAction(SET_BEST, (type, port_id) => ({ type, port_id }));
const setCompare = createAction(SET_COMPARE, (type, compare_id) => ({ type, compare_id }));
const getCompare = createAction(GET_COMPARE, (compare_item, compare_data) => ({ compare_item, compare_data }));
const setInitCompare = createAction(SET_INITCOMPARE, () => ({}));

const changeCommentCnt = createAction(CHANGE_COMMNET_CNT, (change_num) => ({ change_num }));

// initialState
const initialState = {
  list: [],
  port_list: [],
  port_one: {},
  compare_list: [],
  compare_item: [],
  compare_data: [],
};

// middleware
const getResultDB = () => {
  return async function (dispatch, getState, { history }) {
    let end = getState().testform.end_date;
    end = dayjs(end).add("1", "M").format('YYYY-MM-DD');

    let data = {
      startDate: getState().testform.start_date,
      endDate: end,
      seedMoney: parseFloat(getState().testform.init_money * 10000),
      stockList: getState().testform.stockList,
      ratioList: getState().testform.ratioList,
      rebalancingMonth: getState().testform.rebalance_month, 
    };

    if (data.stockList.length === 0 || data.ratioList.length === 0) {
      MySwal.fire({
        title: "종목을 추가해 주세요!",
        confirmButtonColor: '#0075FF',
      });
      return;
    }

    // 실험 금액 100만원 ~ 100,000만원
    if (data.seedMoney < 1000000 || data.seedMoney > 1000000000) {
      MySwal.fire({
        title: "실험금액을 다시 확인해 주세요!",
        confirmButtonColor: '#0075FF',
      });
      return;
    }

    let ratio_sum = data.ratioList.reduce((acc, cur) => {
      return acc = acc + cur;
    }, 0);

    if (ratio_sum < 100) {
      MySwal.fire({
        title: "자산 비율은 100%가 되어야 합니다.",
        confirmButtonColor: '#0075FF',
      });
      return;
    }

    // 
    let diff = dayjs(data.endDate).diff(dayjs(data.startDate), "M")
    if(diff >= 0 && diff <= 3) {
      MySwal.fire({
        title: `<p>실험 기간은 3개월 <br />이상만 가능합니다!</p>`,
        confirmButtonColor: '#0075FF',
      });
      return;
    }

    // 시작날짜와 종료날짜 역순 false
    if (dayjs(data.endDate).isBefore(data.startDate) ||
    (dayjs(data.endDate).format('YYYY-MM-DD') === dayjs(data.startDate).format('YYYY-MM-DD'))
    ) {
      MySwal.fire({
        title: "종료년도가 시작년도 이전입니다!",
        confirmButtonColor: '#0075FF',
      });
      return;
    }
    else {
      try {
        const test_result = await axios.post(
          `https://yuseon.shop/stocks`,
          data
        );

        dispatch(getResult(test_result.data));
        history.push('/result')
      }
      catch (err) {
        let error = err.response.data;
        if (error.statusCode === 404) {
          MySwal.fire({
            title: `<p>${error.responseMessage}의 주식 데이터가 <br /> 실험 기간안에 없습니다.</p>`,
            confirmButtonColor: '#0075FF',
          })
        }
      }
    }
  };
};

const savePortDB = () => {
  return async function (dispatch, getState, { history }) {
    const token = getToken("token");
    let end = getState().testform.end_date;
    end = dayjs(end).add("1", "M").format("YYYY-MM-DD");

    let data = {
      startDate: getState().testform.start_date,
      endDate: end,
      seedMoney: parseFloat(getState().testform.init_money * 10000),
      stockList: getState().testform.stockList,
      ratioList: getState().testform.ratioList,
      rebalancingMonth: getState().testform.rebalance_month,
    };

    try {
      const port_id = await axios.post(`https://yuseon.shop/portfolios`, data, {
        headers: {
          Authorization: `${token}`
        }
      });

      const result = getState().port.list;
      dispatch(savePortOne(port_id.data.portId, result));
    }
    catch (err) {
      let error_msg = err.response.data.statusCode;
      if (error_msg === 400) {
        MySwal.fire({
          title: "실험결과는 3개까지 저장할 수 있습니다.",
          confirmButtonColor: '#0075FF',
        })
      }
    }
  };
};

const getMyPortDB = () => {
  return async function (dispatch, getState, { history }) {
    const token = getToken("token");
    try {
      let response = await axios.get(`https://yuseon.shop/users/portfolios`, {
        headers: {
          Authorization: `${token}`
        }
      })

      dispatch(getPort(response.data));
    }
    catch (err) {
      console.log(err);
    }
  }
}

const getPortOneDB = (port_id) => {
  return async function (dispatch, getState, { history }) {
    try {
      let response = await axios.get(`https://yuseon.shop/portfolios/${port_id}`)

      dispatch(getPortOne(response.data));
      //history.push('/detail');
    }
    catch (err) {
      console.log(err);
      MySwal.fire({
        title: "잘못된 접근입니다.",
        confirmButtonColor: '#0075FF',
      });
    }
  }
}

const deletePortDB = (port_id) => {
  return async function (dispatch, getState, { history }) {
    const token = getToken("token");
    const _port_list = getState().port.port_list;

    try {
      await axios.delete(`https://yuseon.shop/portfolios/${port_id}`, {
        headers: {
          authorization: `${token}`
        }
      })

      const port_idx = _port_list.findIndex((v) => {
        return parseInt(v.portId) === parseInt(port_id)
      })

      dispatch(deletePort(port_idx, port_id));
    }
    catch (err) {
      console.log(err);
    }
  }
}

const setBestDB = (type, port_id) => {
  return async function (dispatch, getState, { history }) {
    const token = getToken("token");

    try {
      await axios.post(`https://yuseon.shop/portfolios/boast`,  {
        portId : port_id,
        myBest: type,
      }, {
        headers: {
          authorization: `${token}`
        }
      })

      dispatch(setBest(type, port_id));
    }
    catch (err) {
      console.log(err);
    }
  }
}

const getCompareDB = () => {
  return async function (dispatch, getState, { history }) {
    const token = getToken("token");

    const compare_list = getState().port.compare_list;
    const port_list = getState().port.port_list

    if (compare_list.length < 2) {
      return;
    }

    try {
      let response = await axios.post(`https://yuseon.shop/portfolios/comparison`,  {
        portIdList : compare_list
      }, {
        headers: {
          authorization: `${token}`
        }
      })

      let compare_item = [];

      port_list.map((p, i) => {
        if (compare_list.includes(p.portId)) {
          compare_item.push(p);
        }
      })

      dispatch(getCompare(compare_item, response.data));
    }
    catch (err) {
      console.log(err);
    }
  }
}

// reducer
export default handleActions(
  {
    [GET_RESULT]: (state, action) =>
      produce(state, (draft) => {
        let _new_list = [];
        _new_list = action.payload.test_result;
        draft.list = _new_list;
      }),
    [SAVE_PORTONE]: (state, action) =>
      produce(state, (draft) => {
        draft.port_list.push({
          myBest: false,
          portId: action.payload.port_id,
          portBacktestingCal: action.payload.result,
        });
      }),
    [GET_PORT]: (state, action) =>
      produce(state, (draft) => {
        draft.port_list.push(...action.payload.port_list);

        draft.port_list = draft.port_list.reduce((acc, cur) => {
          if (acc.findIndex(a => a.portId === cur.portId) === -1) {
            return [...acc, cur];
          } else {
            acc[acc.findIndex(a => a.portId === cur.portId)] = cur;
            return acc;
          }
        }, [])
      }),
    [GET_PORTONE]: (state, action) =>
      produce(state, (draft) => {
        draft.port_one = action.payload.port;
      }),
    [SET_PORTONE_INIT]: (state, action) =>
      produce(state, (draft) => {
        draft.port_one = [];
      }),
    [DELETE_PORT]: (state, action) =>
      produce(state, (draft) => {
        const new_port_list = draft.port_list.filter((p, i) => {
          return parseInt(action.payload.port_idx) !== i;
        })

        const new_compare_list = draft.compare_list.filter((c, i) => {
          return parseInt(action.payload.port_id) !== c;
        })

        draft.port_list = new_port_list;
        draft.compare_list = new_compare_list;
      }),
    [SET_BEST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.port_list.findIndex((p, i) => {
          return p.portId === action.payload.port_id
        });

        draft.port_list[idx].myBest = action.payload.type
      }),
    [SET_COMPARE]: (state, action) =>
      produce(state, (draft) => {
        if (action.payload.type) {
          draft.compare_list.push(action.payload.compare_id)
        }
        else {
          const new_list = draft.compare_list.filter((c, i) => {
            return parseInt(c) !== parseInt(action.payload.compare_id)
          })

          draft.compare_list = new_list;
        }
      }),
    [GET_COMPARE]: (state, action) =>
      produce(state, (draft) => {
        draft.compare_data = [];
        draft.compare_item = [];
        draft.compare_item = action.payload.compare_item;
        draft.compare_data = action.payload.compare_data;
      }),
    [SET_INITCOMPARE]: (state, action) =>
      produce(state, (draft) => {
        draft.compare_list = [];
      }),

    [CHANGE_COMMNET_CNT]: (state, action) =>
      produce(state, (draft) => {
        draft.port_one = {
          ...draft.port_one, 
          commentCnt: (draft.port_one.commentCnt + action.payload.change_num),
        };
      }),
  },
  initialState
);

// action creator export
const actionCreators = {
  getResult,
  getResultDB,
  savePortDB,
  getMyPortDB,
  getPortOneDB,
  deletePortDB,
  setCompare,
  setBestDB,
  getCompareDB,
  setInitCompare,
  changeCommentCnt,
  setPortOneInit,
};

export { actionCreators };
