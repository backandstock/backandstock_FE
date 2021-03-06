import React, { useState } from "react";
import CommentItem from "../CommentItem/CommentItem";
import { useDispatch } from "react-redux";
import { actionCreators as commentActions } from "../../redux/modules/comment";
import { actionCreators as portActions } from "../../redux/modules/port";
import BasicImage from '../../assets/images/basic_image.svg';

import {
  CommentListWrap,
  CancleBtn,
  CommentBtn,
  CommentInputWrap,
  CommnetInput,
  UserImg,
} from "./style";
import { useSelector } from "react-redux";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const CommentList = (props) => {
  const dispatch = useDispatch();

  const { comment_list } = props;
  const user = useSelector(state => state.user.user_info);
  const is_login = useSelector(state => state.user.is_login);

  const [comment, setComment] = useState("");

  const changeComment = (e) => {
    if(e.target.value.length > 100) {
      MySwal.fire({
        title: "댓글은 100글자 까지 가능합니다.",
        confirmButtonColor: '#0075FF',
      })
      return;
    }
    setComment(e.target.value);
  }

  const clickComment = () => {
    if (!is_login) {
      MySwal.fire({
        title: "로그인 후 댓글 작성이 가능합니다.",
        confirmButtonColor: '#0075FF',
      });
      setComment("");
      return;
    }

    if (!comment) {
      MySwal.fire({
        title: "댓글 내용을 입력해주세요!",
        confirmButtonColor: '#0075FF',
      });
      return;
    }
    setComment("");
    dispatch(portActions.changeCommentCnt(1));
    dispatch(commentActions.addCommentDB(props.port_id, comment));
  }


  return (
    <CommentListWrap>
      <CommentInputWrap>
        {is_login ?
          <UserImg user_img={user.profile_img ? user.profile_img : BasicImage} /> :
          <UserImg user_img={BasicImage} />
        }
        <CommnetInput
          type="text"
          placeholder="댓글을 입력해주세요"
          onChange={changeComment}
          value={comment}
        />
        <CommentBtn
          onClick={clickComment}
        >
          작성
        </CommentBtn>
        <CancleBtn
          onClick={() => {
            setComment("");
          }}
        >
          취소
        </CancleBtn>
      </CommentInputWrap>

      {comment_list.map((c, i) => {
        return <CommentItem
          key={i} {...c}
        // reply={c.replyList[i]}
        // comment_list={c}
        />
      })}
    </CommentListWrap>
  );
};

export default CommentList;
