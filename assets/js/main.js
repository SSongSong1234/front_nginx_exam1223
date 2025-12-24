// table 태그 객체를 boardList 변수에 저장
const boardList = document.getElementById("board-list");
// 게시글 데이터를 받아오기 위한 함수 구현
const getList = async () => {
    
    // axios 문법
    let res = await axios.get("http://localhost:8081/list");
    console.log(res.data);
    let boards = res.data; // 서버에서 받아온 데이터
    let resultHTML = `
                <tr>
                    <th>번호</td>
                    <th>글제목</td>
                    <th>작성자</td>
                    <th>작성일자</td>
                    <th>조회수</td>
                </tr>
    `;  // 웹 브라우저에 출력하기 위한 HTML 구조를 임시로 저장
    for (let i = 0; i < boards.length; i++) {
        resultHTML += `
                <tr>     
                    <td>${boards[i].b_idx}</td>
                    <td>${boards[i].b_title}</td>
                    <td>${boards[i].b_writer}</td>
                    <td>${boards[i].b_datetime}</td>
                    <td>${boards[i].b_count}</td>
                </tr>
        `;
    }
    //table 태그에 게시글 데이터(HTML포함)를 출력하겠다!
    boardList.innerHTML = resultHTML;


}
// 게시글 데이터 요청함수 호출(실행)
getList();