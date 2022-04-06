import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { actionCreators as portActions } from "../../redux/modules/port";
import detailLike from '../../assets/images/detail_like.svg'
import {
  CommentList,
  DetailResult,
} from "../../components";
import { actionCreators as commentActions } from "../../redux/modules/comment";
import {
  BestDetailTitle,
  BestDetailWrap,
  CommentCnt,
  CommentWrap,
  ContWrap,
  LikeCnt,
  LikeIcon,
  LikeWrap,
  TitleWrap,
} from "./style";


const BestDetail = (props) => {
  const dispatch = useDispatch();

  const port_id = useParams();

  const user = useSelector(state => state.user.user_info);
  const port_one = useSelector(state => state.port.port_one);
  const result_list = port_one.portBacktestingCal;
  const comment_list = useSelector(state => state.comment.list);

  useEffect(() => {
    dispatch(portActions.getPortOneDB(port_id.id))

    return(() => {
      dispatch(portActions.setPortOneInit());
    });
  }, []);
  
  useEffect(() => {
    dispatch(commentActions.getCommentDB(port_id.id));
  }, [user.nickname]);

  return (
    <BestDetailWrap>
      <ContWrap>
        <TitleWrap>
          <BestDetailTitle>
            {port_one.nickname}의 자산실험
          </BestDetailTitle>
          <LikeWrap>
            <LikeIcon src={detailLike} alt="likecnt" />
            <LikeCnt>좋아요 {port_one.likesCnt} 개</LikeCnt>
          </LikeWrap>
        </TitleWrap>
      {
        result_list &&
        <DetailResult 
          nickname={port_one.nickname}
          type="Best" 
          stock_ratio={port_one.stockRatio}
          result_list={result_list} 
        />
      }
      </ContWrap>

      <CommentWrap>
        <CommentCnt>댓글 {port_one.commentCnt} 개</CommentCnt>
        <CommentList port_id={port_id.id} comment_list={comment_list} />
      </CommentWrap>
    </BestDetailWrap>
  );
};

export default BestDetail;
