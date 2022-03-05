import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components'

const Community = () => {
    const history = useHistory();

    let [modalOpen, setModalOpen] = useState(false);

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div>
            <button onClick={() => history.push('/')}>메인으로 이동</button>
            <h3>포토폴리오</h3>

            <BoxWrap>
                <Box onClick={() => setModalOpen(!modalOpen)}>포토폴리오_1</Box>
                <Box onClick={() => setModalOpen(!modalOpen)}>포토폴리오_2</Box>
                <Box onClick={() => setModalOpen(!modalOpen)}>포토폴리오_3</Box>

                {
                    modalOpen === true
                        ? <Container>
                            <Modalinner>
                                <Close onClick={closeModal}> X </Close>
                                <h1>모달창</h1>
                                <InputWrap>
                                    <Input></Input>
                                    <Btn>댓글등록</Btn>
                                </InputWrap>

                            </Modalinner>
                        </Container>
                        : null
                }

            </BoxWrap>
        </div>
    );
};

const Container = styled.div`
    position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
	background-color: rgba(44, 44, 44, 0.267);
	top: 0;
	left: 0;
	z-index: 999;

`
const Modalinner = styled.div`
    position: relative ;
   display: flex;
	flex-direction: column;
	align-items: center;
	width: 800px;
	height: 800px;
	background-color: white;
	border-radius: 1em;
	padding: 30px;
`
const Close = styled.button`
     position: absolute;
    right: 1.5rem;
    top: 1.5rem;
    cursor: pointer;

`

const BoxWrap = styled.div`
    display: flex;
`

const Box = styled.div`
    width: 100px;
    height: 100px;
    margin: 50px;
    background-color: lightskyblue;
`
const InputWrap = styled.div`
    display: flex;

`
const Input = styled.input`
    width: 500px;
    height: 30px;
`

const Btn = styled.button`
    width: 100px;
    height: 30px;
    margin-left: 20px;
`



export default Community;