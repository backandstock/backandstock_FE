import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import axios from "axios";
import { getToken } from '../../shared/token';

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// actions
const GET_POST = "GET_POST";
const DELETE_POST = "DELETE_POST";
const GET_TOPFIVE = "GET_TOPFIVE";
const LIKE_POST = "LIKE_POST";
const DELETELIKE_POST = "DELETELIKE_POST";

const CHANGE_SORT = "CHANGE_SORT";
const SET_SORT_OPTION = "SET_SORT_OPTION";
const SET_POST_INIT = "SET_POST_INIT";

// action creators
const getPost = createAction(GET_POST, (post_list) => ({ post_list }));
const deletePost = createAction(DELETE_POST, (portId) => ({ portId }));
const getTopFive = createAction(GET_TOPFIVE, (Top_list) => ({ Top_list }));
const likePost = createAction(LIKE_POST, (idx, nickname) => ({ idx, nickname }));
const deletelikePost = createAction(DELETELIKE_POST, (idx, nickname) => ({ idx, nickname }));

const changeSort = createAction(CHANGE_SORT, (post_list) => ({ post_list }));
const setSortOption = createAction(SET_SORT_OPTION, (sort_option) => ({ sort_option }));
const setPostInit = createAction(SET_POST_INIT, () => ({ }));

// initialState
const initialState = {
  list: [],
  top_five_list: [],
  sort_option: "like",
  load_complete: false,
};

// middlewares
const getPostDB = (init_check, sort_option) => {
  return async function (dispatch, getState, { history }) {
    let _list = getState().community.list;

    let response = {};

    if(init_check) {
      // 처음 로딩
      try {
        response = await axios.get(`https://yuseon.shop/portfolios/boast`, {
          params: {
            page: 1,
            size: 9,
          },
        });

        dispatch(getPost(response.data));
      }
      catch (err) {
        console.log(err);
      }
    }
    // 처음 이후에 로딩
    else {
      try {
        if(sort_option === "like") {
          response = await axios.get(`https://yuseon.shop/portfolios/boast`, {
            params: {
              page: Math.ceil(_list.length / 9) + 1,
              size: 9,
            },
          });
        }
        else if(sort_option === "all") {
          response = await axios.get(`https://yuseon.shop/portfolios/latest`, {
            params: {
              option: sort_option,
              page: Math.ceil(_list.length / 9) + 1,
              size: 9,
            },
          });
        }

        if (
          _list.length !== 0 && 
          response.data.length === 0 &&
          !init_check
        ) {
          dispatch(getPost(false));
          MySwal.fire({
            title: "더 이상 포트폴리오가 없습니다.",
            confirmButtonColor: '#0075FF',
          });
          return;
        }
        dispatch(getPost(response.data));
      }
      catch (err) {
        console.log(err);
      }
    }
  }
}

// 최신순, 좋아요 순 정렬
const changeSortDB = (sort_option) => {
  return async function (dispatch, getState, { history }) {
    try {
      let response = {};
      if(sort_option === "all") {
        response = await axios.get(`https://yuseon.shop/portfolios/latest`, {
          params: {
            option: sort_option,
            page: 1,
            size: 9,
          },
        });
      }
      else if(sort_option === "like") {
        response = await axios.get(`https://yuseon.shop/portfolios/boast`, {
          params: {
            page: 1,
            size: 9,
          },
        });
      }
      
      dispatch(changeSort(response.data));
    }
    catch (err) {
      console.log(err);
    }
  };
};

const getTopFiveDB = () => {
  return async function (dispatch, getState, { history }) {
    try {
      let response = await axios.get(`https://yuseon.shop/stocks/topfive`)

      dispatch(getTopFive(response.data));
    }
    catch (err) {
      console.log(err);
    }
  };
};

/* like수정 */
const likePostDB = (port_id, user_id, like) => {
  return async function (dispatch, getState, { history }) {
    const token = getToken("token");
    const community_list = getState().community.list;

    try {
      axios.post(`https://yuseon.shop/portfolios/${port_id}/likes`, {
        userId: user_id
      }, {
        headers: {
          authorization: `${token}`
        }
      });

      let idx = community_list.findIndex(c => {
        return c.communityPort.portId === port_id;
      })

      dispatch(likePost(idx, user_id));

    } catch (err) {
      console.log(err);
    }
  };
};

const deletelikePostDB = (port_id, user_id) => {
  return async function (dispatch, getState, { history }) {
    const token = getToken("token");
    const community_list = getState().community.list;
    console.log(token);
    try {
      axios.delete(`https://yuseon.shop/portfolios/${port_id}/likes`,
        {
          headers: {
            authorization: `${token}`
          }
        });

      let idx = community_list.findIndex(c => {
        return c.communityPort.portId === port_id;
      })

      //좋아요 취소
      dispatch(deletelikePost(idx, user_id));

    } catch (err) {
      console.log(err);
    }
  };
};

// reducer
export default handleActions(
  {
    [GET_POST]: (state, action) =>
      produce(state, (draft) => {
        if(!action.payload.post_list) {
          draft.load_complete = !action.payload.post_list;
          return ;
        }

        draft.list.push(...action.payload.post_list);
        let _new_list = draft.list.reduce((acc, cur) => {
          if (
            acc.findIndex(
              (a) => a.communityPort.portId === cur.communityPort.portId
            ) === -1
          ) {
            return [...acc, cur];
          } else {
            acc[
              acc.findIndex(
                (a) => a.communityPort.portId === cur.communityPort.portId
              )
            ] = cur;
            return acc;
          }
        }, [])

        //좋아요 순 정렬
        //draft.list = _new_list.sort((a, b) => b.likesCnt - a.likesCnt);
        draft.list = _new_list;
      }),

    [CHANGE_SORT]: (state, action) =>
      produce(state, (draft) => {
        draft.list = [];
        draft.list.push(...action.payload.post_list);
      }),

    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        let new_list = draft.list.filter((d) => {
          return d.communityPort.portId !== action.payload.portId;
        })

        draft.list = new_list;
      }),

    [LIKE_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list[action.payload.idx].likesUsers.push(action.payload.nickname)
        draft.list[action.payload.idx].likesCnt += 1;

        //좋아요 순 정렬
        //draft.list = draft.list.sort((a, b) => b.likesCnt - a.likesCnt);
      }),

    [DELETELIKE_POST]: (state, action) =>
      produce(state, (draft) => {
        let new_likeUsers = draft.list[action.payload.idx].likesUsers.filter(u => {
          return u !== action.payload.nickname;
        })
        draft.list[action.payload.idx].likesUsers = new_likeUsers;
        draft.list[action.payload.idx].likesCnt -= 1;
        //좋아요 순 정렬
        //draft.list = draft.list.sort((a, b) => b.likesCnt - a.likesCnt);
      }),

    [GET_TOPFIVE]: (state, action) =>
      produce(state, (draft) => {
        draft.top_five_list.push(...action.payload.Top_list);

        draft.top_five_list = draft.top_five_list.reduce((acc, cur) => {
          if (
            acc.findIndex(
              (a) => a.option === cur.option
            ) === -1
          ) {
            return [...acc, cur];
          } else {
            acc[
              acc.findIndex(
                (a) => a.option === cur.option
              )
            ] = cur;
            return acc;
          }
        }, [])
      }),

    [SET_SORT_OPTION]: (state, action) =>
      produce(state, (draft) => {
        draft.sort_option = action.payload.sort_option;
      }),
      
    [SET_POST_INIT]: (state, action) =>
      produce(state, (draft) => {
        draft.list = [];
      }),
  },
  initialState
);

// action creator export
const actionCreators = {
  getPostDB,
  likePostDB,
  deletelikePostDB,
  getTopFiveDB,
  getTopFive,
  deletePost,
  deletelikePost,
  setPostInit,
  changeSortDB,
  setSortOption,
};

export { actionCreators };