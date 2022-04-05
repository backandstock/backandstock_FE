import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { history } from '../../redux/configStore';
import { useDispatch, useSelector } from 'react-redux';


import { CommunityTitle, CommunityWrap, PageBtn, PageHr, PageWrap, SortCircle, SortText, SortWrap, Title } from "./style";
import { actionCreators as communityActions } from '../../redux/modules/community';
import { CommunityList, Slide } from '../../components';

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Community = () => {
  const dispatch = useDispatch();

  const top_list = useSelector((state) => state.community.top_five_list)
  const community_list = useSelector(state => state.community.list);
  const sort = useSelector(state => state.community.sort_option);
  const load_complete = useSelector(state => state.community.load_complete);
  
  const [page, setPage] = useState(1);
  const [sort_option, setSortOption] = useState("like");

  useEffect(() => {
    dispatch(communityActions.getTopFiveDB());
    dispatch(communityActions.getPostDB(true, "like"));
  }, [])

  useEffect(() => {
    setSortOption(sort);
  }, [sort])

  return (
    <CommunityWrap>
      <Title>
        포토폴리오 자랑하고<br />
        사람들과 소통해보세요!
      </Title>
      {
        top_list &&
        <Slide top_list={top_list} />
      }

      <CommunityTitle>
        포트폴리오 뽐내기
      </CommunityTitle>
      <SortWrap>
        <SortCircle sort_option={sort_option === "all" ? "#0075FF" : "#c4c4c4"} />
        <SortText
          onClick={() => {
            setSortOption("all");
            dispatch(communityActions.changeSortDB("all"))
            dispatch(communityActions.setSortOption("all"))
          }}
          sort_option={sort_option === "all" ? "#0075FF" : "#c4c4c4"} 
        >
          최신순
        </SortText>
        <SortCircle sort_option={sort_option === "like" ? "#0075FF" : "#c4c4c4"} />
        <SortText
          onClick={() => {
            setSortOption("like");
            dispatch(communityActions.changeSortDB("like"))
            dispatch(communityActions.setSortOption("like"))
          }} 
          sort_option={sort_option === "like" ? "#0075FF" : "#c4c4c4"}
        >
          좋아요순
        </SortText>
      </SortWrap>
      {community_list &&
        <CommunityList community_list={community_list} />
      }
      <PageWrap>
        {/* <PageHr /> */}
        <PageBtn
          onClick={() => {
            if(load_complete) {
              MySwal.fire({
                title: "더 이상 포트폴리오가 없습니다.",
                confirmButtonColor: '#0075FF',
              });
              return;
            }
            dispatch(communityActions.getPostDB(false, sort_option));
            setPage(prevState => prevState + 1);
          }}
        >
          더보기
        </PageBtn>
      </PageWrap>
    </CommunityWrap>
  );
};

export default Community;