// 작성버튼을 클릭했을 때,
// 작성된 글 내용을 하나의 객체로 묶어서 서버에 전송하는 기능 구현

const addBtn = document.getElementById("addBtn");

const addBoard = async (event) => {
    // 전송기능 중단하기
    event.preventDefault();

    // 1. 작성된 글 내용 가져온 후 하나의 객체로 묶기
    // → form 태그 안에 있는 입력요소(input, textarea)
    let boardFrm = document.boardFrm; // form요소 정보

    // FormData 객체 : form태그 내 있는 입력요소를 하나로 묶어주기 위한 객체
    // get(name속성) : 특정 입력요소의 정보를 가져오는 메소드
    // ContentType 형식 : multipart/form-data(파일업로드)
    // ex) <form enctype:"multipart/form-data"></form>
    let bData = new FormData(boardFrm);
    console.log(bData.get("b_title"));

    // 2. 서버에 데이터 전송하기
    try{
        
        // let res = await axios.post("http://localhost:8081/api/board/register", bData); // 테스트용
        let res = await axios.post("/api/board/register", bData);
        console.log(res.data);

        // 글 작성완료 후 게시판 페이지로 이동
        location.href = "borad.html";

    }catch(err){
        console.log(err);
    }

    // 3. 성공적으로 작성되었다면, 게시판 페이지로 이동하기


}

addBtn.addEventListener("click", addBoard);