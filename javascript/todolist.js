//투두리스트(재원)---------------------
const K = "todo";
const $todo_form = document.querySelector("#todo_form");
const $todo_input = document.querySelector("#todo_input");
const $todo_list = document.querySelector("#todo_list");
const $start_time = document.querySelector("#startTime");
const $end_time = document.querySelector("#endTime");
const $cal_table = document.querySelector("#tablebody");

$cal_table.onclick = function (e) {
  //달력 내의 날짜 클릭시 투두리스트 갱신
  if (e.target.tagName != "TD") {
    //잘못 클릭할 경우
    return;
  }
  load();
};

let todo_storage; //localstorage에 넣을 객체 배열
let today_storage; //현재 날짜의 할일을 넣을 배열
let today_index; //전체 todo배열에서 가져온 오늘 날짜의 인덱스
$todo_form.addEventListener("submit", input_todo);
load();
function load() {
  //할 일을 불러오는 함수

  //투두리스트 안에 표시된 모든 할 일 선택
  let all = document.querySelectorAll("#todo_list li");
  //투두리스트 안에 표시된 모든 할 일 제거
  all.forEach((li) => li.remove());

  let $year = document.querySelector("#thisYear"); //달력에서 현재 위치한 년도 불러오기
  let $sel_day = document.querySelector("#selected"); //달력에서 선택한날짜 불러오기
  let $month = document.querySelector("#thisMonth"); //달력에서 현재 위치한 달 불러오기
  let $date = $year.innerText + $month.innerText + $sel_day.innerText;
  todo_storage = [];
  today_storage = [];
  today_id = [];
  const load_todo = localStorage.getItem(K); //localstorage에서 불러오기
  if (load_todo) {
    todo_storage = JSON.parse(load_todo); //localstorage에 있는 문자열을 다시 배열로 변환해서 저장
    today_storage = todo_storage.filter((todo) => todo.date == $date);
    today_id = get_id(todo_storage, $date); //todo_storage에서 오늘 날짜를 값으로 가지고 있는 배열의 인덱스
    for (let i = 0; i < today_storage.length; i++) {
      //불러온 함수를 표시하기
      add_todo(today_storage[i]);
    }
  }
}

function input_todo(e) {
  //할 일 입력시
  e.preventDefault(); //새로고침 방지
  $year = document.querySelector("#thisYear");
  $month = document.querySelector("#thisMonth");
  $sel_day = document.querySelector("#selected"); // 선택한 날짜 지정
  let date = $year.innerText + $month.innerText + $sel_day.innerText; //일정을 추가한 날짜 yymmdd
  const todo_text = $todo_input.value; //입력받은 할 일을 변수에 저장
  console.log(todo_text);
  if (todo_text == "") {
    //아무것도 입력하지 않았을 때
    alert("할 일을 입력하세요!!");
    console.log("hi");
    return;
  }
  if ($sel_day == null) {
    //날짜를 선택하지 않았을 때
    alert("날짜를 선택해주세요!!");
    return;
  }
  if($start_time.value == "00:00" && $end_time.value == "00:00"){
    //시간을 선택하지 않았을 때
    alert("시간을 선택해주세요");
    return;
  }
  const todo_info = {
    //텍스트와 id를 저장할 객체
    text: todo_text,
    id: Date.now(), //현재시간으로 id를 주어 각각의 할 일 구분
    date: date, //일정을 추가한 날짜
    start: $start_time.value, //시작 시간
    end: $end_time.value, //마감 시간
    done: false, //체크박스가 체크 되어있으면 true로 변경
  };
  add_todo(todo_info); //화면에 표시하는 함수 호출
  today_storage.push(todo_info); //오늘 할일 배열에 최신화
  todo_storage.push(todo_info); //전체 할일 배열에 최신화
  refresh_todo();
}


function add_todo(info) {
  //할 일을 화면에 표시하는 함수(할일,버튼들 추가)

  const list = document.createElement("li"); //li태그 생성
  list.id = info.id; //현재 시간을 id로 설정

  const text = document.createElement("span"); //span태그 생성(줄바꿈 방지를 위해 div대신 사용)
  text.innerText = info.text + " "; //입력받은 텍스트 삽입

  // 민형님 삭제/수정 파트----------------------------
  const checkbox = document.createElement("input"); // 체크박스 생성
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", toggleStrikeThrough); // 체크박스 체크 시

  if (info.done == true) {
    // 새로고침해도 체크 유지하기----(재원)
    text.classList.toggle("strike-through");
    checkbox.checked = true;
  }

  const editButton = document.createElement("button"); // 수정버튼 생성
  editButton.innerHTML = '<i class="far fa-edit"></i>';
  editButton.classList.add("edit-button");
  editButton.addEventListener("click", editTodo); // 수정버튼 클릭 시

  const removeButton = document.createElement("button"); //삭제버튼 생성
  removeButton.innerHTML = '<i class="far fa-trash-alt"></i>';
  removeButton.classList.add("remove-button");
  removeButton.addEventListener("click", remove_todo); //삭제버튼 클릭시

  const editInput = document.createElement("input"); //수정버튼 클릭 시 입력창 생성
  editInput.type = "text";
  editInput.classList.add("edit-input");
  editInput.value = info.text;
  editInput.style.display = "none";
  editInput.addEventListener("keydown", handleEditKeydown); // 엔터키 입력 시
  editInput.addEventListener("blur", handleEditBlur); // 입력 창이 아닌 다른 부분 클릭 시
  //------------------------------------민형님 삭제/수정 파트

  $todo_list.appendChild(list); //ul태그에 list추가
  list.appendChild(checkbox); //리스트에 체크박스 추가
  list.appendChild(text); //리스트에 텍스트 추가
  list.appendChild(editButton); //리스트에 버튼 추가
  list.appendChild(removeButton); //리스트에 버튼 추가
  list.appendChild(editInput); //리스트에 입력창 추가
}

function refresh_todo() {
  //localstorage에 최신화 시키기
  localStorage.setItem(K, JSON.stringify(todo_storage));
  //JSON_stringify : 요소를 문자열로 바꿔주는 함수
}

function get_id(arr, date) {
  //객체 배열에서 해당 객체의 날짜 값과 현재 날짜의 값이 같은 요소의 인덱스를 가져오는 함수
  let indexes = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].date == date) {
      indexes.push(arr[i].id);
    }
  }
  return indexes; //인덱스 번호가 모인 배열을 리턴
}

//민형님 삭제/수정 파트---------------------------------------------
function remove_todo(e) {
  //삭제하는 함수
  //일정 삭제하기
  const removeButton = e.target; //부모 태그(li 태그) 선택
  const list = removeButton.closest("li"); // 최상위 li 요소를 선택하기 위해 closest() 메소드 사용
  //id가 다른 값(제거할 값)을 빼고 다시 배열 생성해서 저장
  if (list) {
    list.remove();
    //재원-----------------
    today_storage = today_storage.filter(
      //삭제를 클릭한 id와 남아있는 일정의 id가 같지 않을때 배열 생성(삭제한 것을 빼고 다시 배열 생성)
      (remain) => remain.id !== parseInt(list.id)
    );
    todo_storage = todo_storage.filter((remain)=> remain.id !== parseInt(list.id));
  }
}

function toggleStrikeThrough(event) {
  //완료하면 취소선
  //완료체크 되면 done을 true로 뱌꾸기(취소선 유지)-----(재원)
  const id = parseInt(event.target.parentElement.id); //현재 할일의 id
  const todo = today_storage.find((todo) => todo.id == id); //현재 할일의 local배열 인덱스 가져오기
  if (todo.done == true) {
    //이미 완료한 일 일경우 false로 변경
    todo.done = false;
  } else {
    //완료하지 않은 일이면 true로 변경
    todo.done = true;
  }
  refresh_todo(); //localstorage 새로고침
  //----------------------------------------------------------
  const text = event.target.nextSibling; // 체크박스 다음에 위치한 텍스트 요소 선택
  text.classList.toggle("strike-through"); // 텍스트에 줄 긋기 스타일 토글
}

function editTodo(event) {
  const editButton = event.target;
  const list = editButton.closest("li"); // 최상위 li 요소를 선택하기 위해 closest() 메소드 사용

  if (list) {
    const text = list.querySelector("span"); // 텍스트 요소 선택
    const editInput = list.querySelector(".edit-input"); // 수정 입력창 선택

    if (editInput && editInput.style.display === "none") {
      // 수정 모드로 전환
      text.style.display = "none";
      editInput.style.display = "inline-block";
      editInput.value = text.innerText.trim();
      editInput.focus();
      editButton.classList.add("editing"); // 수정 중임을 나타내는 클래스 추가
      list.querySelector(".remove-button").style.visibility = "hidden"; // 삭제 버튼 숨김
    } else {
      // 수정 완료 또는 취소
      const newText = editInput ? editInput.value.trim() : "";

      if (newText !== "") {
        // 텍스트가 비어있지 않으면 수정 완료
        const todoId = parseInt(list.id);
        const todo = todo_storage.find((todo) => todo.id === todoId);
        todo.text = newText;
        text.innerText = newText + " ";
        refresh_todo(); // 할 일 목록 저장소 업데이트
      } else {
        // 텍스트가 비어있으면 삭제
        remove_todo(list);
      }

      cancelEdit(editInput); // 수정 취소
      text.style.display = "inline";
      editButton.classList.remove("editing"); // 수정 중임을 나타내는 클래스 제거
      const removeButton = list.querySelector(".remove-button");
      removeButton.style.visibility = "visible"; // 삭제 버튼 다시 나타내기
    }
  }
}

function cancelEdit(editInput) {
  // 수정 취소
  const list = editInput.parentElement;
  const text = list.querySelector("span"); // 기존에 있던 list 값 복구

  text.style.display = "inline";
  editInput.style.display = "none";

  const editButton = list.querySelector(".edit-button");
  const removeButton = list.querySelector(".remove-button");

  editButton.style.visibility = "visible"; // 수정 버튼 다시 표시
  removeButton.style.visibility = "visible"; // 삭제 버튼 다시 표시
}

function handleEditKeydown(event) {
  // 편집 모드 중 키다운 이벤트 처리
  if (event.key === "Enter") {
    // 엔터키
    event.preventDefault();
    const editInput = event.target;
    const list = editInput.parentElement;
    const todoId = parseInt(list.id);
    const todo = todo_storage.find((todo) => todo.id === todoId);
    const newText = editInput.value.trim();

    if (newText !== "") {
      // 텍스트가 비어있지 않으면 수정 완료
      todo.text = newText;
      list.querySelector("span").innerText = newText + " ";
      refresh_todo(); // 할 일 목록 저장소 업데이트
    } else {
      // 텍스트가 비어있으면 삭제
      remove_todo(list);
    }

    editInput.blur();
    const editButton = list.querySelector(".edit-button");
    editButton.style.visibility = "visible"; // 수정 버튼 다시 표시
  } else if (event.key === "Escape") {
    // esc 키
    cancelEdit(event.target); // 수정 취소
  }
}

function handleEditBlur(event) {
  // 편집 모드 중 블러 이벤트 처리
  cancelEdit(event.target); // 편집 취소
  const list = event.target.parentElement;
  const editButton = list.querySelector(".edit-button");
  editButton.style.visibility = "visible"; // 수정 버튼 다시 표시
}
