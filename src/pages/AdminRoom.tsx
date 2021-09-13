import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useParams } from "react-router-dom";
//import { useState, FormEvent, useEffect } from 'react';
import { useRoom } from "../hooks/useRoom";
import imageDelete from '../assets/images/delete.svg';
import "../styles/room.scss";
//import { useAuth } from './../hooks/useAuth';
import { database } from "../services/firebase";
import { Question } from "../components/Question";
import { useHistory } from 'react-router-dom'


type RoomParams = {
    id: string;
}

export function AdminRoom() {
    //const { user } = useAuth();
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const { questions, title } = useRoom(roomId);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })
        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }



    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>

                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}

                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            >
                                <button
                                    className="like-button"
                                    type="button"
                                    aria-label="deletar pergunta"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={imageDelete} alt="deletar" />
                                </button>

                            </Question>
                        )
                    })}
                </div>

            </main>
        </div>
    );
}