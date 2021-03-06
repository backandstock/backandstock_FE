import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { history } from "../../redux/configStore";
import {
  SideTapWrap,
  SideUserWrap,
  UserImg,
  Username,
  UserText,
  ProfileBtn,
  TabWrap,
  Tab,
  TabTitle,
  TabContent,
  TabDesc,
  TabIcon,
  TabClicked,
  TabClickedDesc,
  TabClickedTitle,
  UserBtnWrap,
  LoginBtn,
  SignupBtn,
  LabIcon,
  ProfileWrap,
  ProfileCloseBtn,
} from "./style";

import LabClick from "../../assets/images/lab_blue.svg";
import LabGray from "../../assets/images/lab_gray.svg";
import PortfolioClick from "../../assets/images/portfolio_blue.svg";
import PortfolioGray from "../../assets/images/portfolio_gray.svg";
import CommunityClick from "../../assets/images/community_blue.svg";
import CommunityGray from "../../assets/images/community_gray.svg";
import BasicImage from '../../assets/images/basic_image.svg'

import UserProfile from "../UserProfile/UserProfile";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const SideTap = (props) => {
  const location = useSelector((state) => state.router.location.pathname);
  const is_login = useSelector((state) => state.user.is_login);
  const user = useSelector((state) => state.user.user_info);

  const [lab_clicked, setLabClicked] = useState(true);
  const [portf_clicked, setPortfClicked] = useState(false);
  const [commu_clicked, setCommuClicked] = useState(false);
  const [profile_clicked, setProfileClicked] = useState(false);
  const [user_profile, setUserProfile] = useState(user.profile_img);

  useEffect(() => {
    if (location.includes("/community")) {
      setLabClicked(false);
      setPortfClicked(false);
      setCommuClicked(true);
    } else if (location === "/mypage") {
      setLabClicked(false);
      setPortfClicked(true);
      setCommuClicked(false);
    } else if (location === "/") {
      setLabClicked(true);
      setPortfClicked(false);
      setCommuClicked(false);
    } else if (location.includes("/detail")) {
      setLabClicked(false);
      setPortfClicked(true);
      setCommuClicked(false);
    }
  }, [lab_clicked, portf_clicked, commu_clicked, location]);

  useEffect(() => {
    setUserProfile(user.profile_img);
  }, [user]);

  return (
    <SideTapWrap>
      {is_login ? (
        <SideUserWrap>
          <UserImg img_url={user_profile ? user_profile : BasicImage} />
          <Username>{user.nickname}</Username>
          <UserText>
            ????????? ?????? ????????? <br />
            ????????? ??????????
          </UserText>
          <ProfileWrap>
            {profile_clicked && (
              <UserProfile setProfileClicked={setProfileClicked} />
            )}
            {profile_clicked && (
              <ProfileCloseBtn
                onClick={() => {
                  setProfileClicked(false);
                }}
              >
                x
              </ProfileCloseBtn>
            )}
            <ProfileBtn
              onClick={() => {
                setProfileClicked(!profile_clicked);
              }}
            >
              ????????? ????????????
            </ProfileBtn>
          </ProfileWrap>
        </SideUserWrap>
      ) : (
        <SideUserWrap>
          <UserImg img_url={BasicImage}/>
          <Username>????????????</Username>
          <UserText>
            ???????????? ?????? ????????? <br />
            ????????? ??? ?????????
          </UserText>
          <UserBtnWrap>
            <LoginBtn
              onClick={() => {
                history.push("/login");
              }}
            >
              ?????????
            </LoginBtn>
            <SignupBtn
              onClick={() => {
                history.push("/signup");
              }}
            >
              ????????????
            </SignupBtn>
          </UserBtnWrap>
        </SideUserWrap>
      )}
      <TabWrap>
        {!lab_clicked ? (
          <Tab
            onClick={() => {
              setLabClicked(true);
              setPortfClicked(false);
              setCommuClicked(false);
              history.push("/");
              window.scrollTo(0, 0);
            }}
          >
            <TabIcon>
              <LabIcon src={LabGray} alt="right" />
            </TabIcon>
            <TabContent>
              <TabTitle>?????????</TabTitle>
              <TabDesc>????????? ????????? ??????????????????</TabDesc>
            </TabContent>
          </Tab>
        ) : (
          <TabClicked
            onClick={() => {
              setLabClicked(true);
              setPortfClicked(false);
              setCommuClicked(false);
              history.push("/");
              window.scrollTo(0, 0);
            }}
          >
            <TabIcon>
              <LabIcon src={LabClick} alt="right" />
            </TabIcon>
            <TabContent>
              <TabClickedTitle>?????????</TabClickedTitle>
              <TabClickedDesc>????????? ????????? ??????????????????</TabClickedDesc>
            </TabContent>
          </TabClicked>
        )}
        {!portf_clicked ? (
          <Tab
            onClick={() => {
              if (!is_login) {
                MySwal.fire({
                  title: "???????????? ????????? ??????????????????.",
                  confirmButtonColor: '#0075FF',
                });
                return;
              }
              setLabClicked(false);
              setPortfClicked(true);
              setCommuClicked(false);
              history.push("/mypage");
              window.scrollTo(0, 0);
            }}
          >
            <TabIcon>
              <LabIcon src={PortfolioGray} alt="right" />
            </TabIcon>
            <TabContent>
              <TabTitle>???????????????</TabTitle>
              <TabDesc>????????? ????????? ????????? ?????????</TabDesc>
            </TabContent>
          </Tab>
        ) : (
          <TabClicked
            onClick={() => {
              if (!is_login) {
                MySwal.fire({
                  title: "???????????? ????????? ??????????????????.",
                  confirmButtonColor: '#0075FF',
                });
                return;
              }
              setLabClicked(false);
              setPortfClicked(true);
              setCommuClicked(false);
              history.push("/mypage");
              window.scrollTo(0, 0);
            }}
          >
            <TabIcon>
              <LabIcon src={PortfolioClick} alt="right" />
            </TabIcon>
            <TabContent>
              <TabClickedTitle>???????????????</TabClickedTitle>
              <TabClickedDesc>????????? ????????? ????????? ?????????</TabClickedDesc>
            </TabContent>
          </TabClicked>
        )}
        {!commu_clicked ? (
          <Tab
            onClick={() => {
              setLabClicked(false);
              setPortfClicked(false);
              setCommuClicked(true);
              history.push("/community");
              window.scrollTo(0, 0);
            }}
          >
            <TabIcon>
              <LabIcon src={CommunityGray} alt="right" />
            </TabIcon>
            <TabContent>
              <TabTitle>????????????</TabTitle>
              <TabDesc>????????? ?????? ????????? ???????????????</TabDesc>
            </TabContent>
          </Tab>
        ) : (
          <TabClicked
            onClick={() => {
              setLabClicked(false);
              setPortfClicked(false);
              setCommuClicked(true);
              history.push("/community");
              window.scrollTo(0, 0);
            }}
          >
            <TabIcon>
              <LabIcon src={CommunityClick} alt="right" />
            </TabIcon>
            <TabContent>
              <TabClickedTitle>????????????</TabClickedTitle>
              <TabClickedDesc>????????? ?????? ????????? ???????????????</TabClickedDesc>
            </TabContent>
          </TabClicked>
        )}
      </TabWrap>
    </SideTapWrap>
  );
};

export default SideTap;