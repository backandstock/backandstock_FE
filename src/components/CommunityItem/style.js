import styled from 'styled-components';

export const CommunityItemWrap = styled.div`
  position: relative;
  margin-bottom: 16px;
  padding-top: 16px;
  width: 280px;
  height: 290px;
  border-radius: 10px;
  background-color: var(--secondary-color);
`;

export const CardClickWrap = styled.div`
  cursor: pointer;
`;

export const LikeBtn = styled.img`
  position: absolute;
  top: 16px;
  right: 20px;
  width: 46px;
  height: 46px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1000;
`;

export const ItemTop = styled.div`
  position: relative;
  padding-left: 20px;
`;

export const ItemTitle = styled.h3`
  margin-bottom: 16px;
  font-size: var(--font-main);
  font-weight: 800;
  line-height: var(--line-main);
  color: #000;
`;

export const IconWrap = styled.div`
  position: absolute;
  top: 19px;
  left: 98px;
  display: flex;
  align-items: center;
`;

export const CardIcon = styled.img`
  margin-top: 2px;
  margin-right: 4px;
  width: 10px;
  height: 10px;
`;

export const InfoCnt = styled.p`
  width: 20px;
  font-size: 12px;
  line-height: 28px;
  color: #818181;
`;

export const ItemMid = styled.div`
  padding-top: 20px;
  padding-left: 18px;
  width: 280px;
  height: 220px;
  border: 3px solid var(--secondary-color);
  border-radius: 10px;
  background-color: #fff;
`;

export const MoneyTitle = styled.p`
  margin-left: 2px;
  margin-bottom: 12px;
  font-size: var(--font-small);
  font-weight: 600;
  line-height: var(--line-small);
`;

export const StockContWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const StockInfoWrap = styled.div`
  margin-right: 6px;
  width: 110px;
  display: flex;
  align-items: center;
`;

export const StockCircle = styled.div`
  margin-left: 2px;
  margin-right: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--primary-color);
`;

export const StockName = styled.p`
  margin-right: 2px;
  width: 90px;
  height: 26px;
  font-size: var(--font-small);
  font-weight: 600;
  line-height: 1.6;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* 라인수 */
  -webkit-box-orient: vertical;
  word-wrap:break-word; 
`;

export const StockRatio = styled.p`
  width: 35px;
  height: 26px;
  font-size: var(--font-small);
  font-weight: 600;
  line-height: 1.6;
`;

export const ItemBottom = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  padding-left: 16px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 52px;
  border-radius: 10px;
  background-color: var(--secondary-color);
`;

export const FinalRate = styled.h3`
  margin-bottom: 10px;
  font-size: 36px;
  font-weight: 800;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: var(--primary-color);
`;

export const FinalMoney = styled.p`
  margin-left: 2px;
  margin-bottom: 12px;
  font-size: var(--font-large);
  font-weight: 800;
  line-height: var(--line-large);
  letter-spacing: 0.15px;
`;