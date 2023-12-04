import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../store/actions";
import { LoginInfo, RedP } from "./Movies.style";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const LoginComponent = ({ setIsLoggedIn }) => {
  const [Id, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    // 페이지 로드 시 토큰 삭제
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
  }, [setIsLoggedIn]);
  const handleLogin = async () => {
    if (!Id || !password) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        id: Id,
        pw: password,
      });

      setTimeout(() => {
        dispatch(loginSuccess(response.data.userInfo));
        setIsLoggedIn(true);
        alert("로그인 성공!!", { state: { isLoggedIn: true } });
        navigate("/home");

        setLoading(false);
      }, 1500);
      console.log(response.data);
      const { AccessToken, userId } = response.data.result;
      localStorage.setItem("token", AccessToken);
      localStorage.setItem("userId", userId);
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        alert("로그인에 실패했습니다.");

        if (status === 400) {
          alert("아이디와 비밀번호를 입력해주세요.");
        } else if (status === 401) {
          alert("존재하지 않는 아이디입니다.");
        } else if (status === 402) {
          alert("비밀번호가 틀렸습니다.");
        }

        // dispatch(loginFailure(errorMessage));
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginInfo>
      <h2>이메일과 비밀번호를 입력해주세요</h2>
      <p>이메일 주소</p>
      <input
        type="text"
        placeholder="아이디"
        value={Id}
        onChange={(e) => setUserId(e.target.value)}
      />
      {Id ? <RedP>&nbsp;</RedP> : <RedP>올바른 이메일을 입력해주세요.</RedP>}
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {password ? (
        <RedP>&nbsp;</RedP>
      ) : (
        <RedP>영문, 숫자, 특수문자 포함 8자 이상 입력하세요.</RedP>
      )}
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Loading..." : "로그인"}
      </button>
    </LoginInfo>
  );
};
LoginComponent.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired, // prop-types 추가
  isLoggedIn: PropTypes.bool.isRequired,
};

export default LoginComponent;
