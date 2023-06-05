let todo_storage = [];
const K = "todo";
const $todo_form = document.querySelector("#todo_form");
const $todo_input = document.querySelector("#todo_input");
const $todo_list = document.querySelector("#todo_list");
$todo_form.addEventListener("submit", input_todo);


const load_todo = localStorage.getItem(K); //localstorage에서 불러오기
if(load_todo){
    const loaded = JSON.parse(load_todo); //localstorage에 있는 문자열을 다시 배열로 변환
    todo_storage = loaded; //배열에 저장
    for(let i = 0 ; i < todo_storage.length; i++){  //불러온 함수를 표시하기
        add_todo(todo_storage[i]);  
    }
}

function input_todo(e){ //할 일 입력시
    e.preventDefault(); //새로고침 방지
    const todo_text = $todo_input.value; //입력받은 할 일을 변수에 저장
    if($todo_input.value == ""){  //아무것도 입력하지 않았을 때
      alert("할 일을 입력하세요!!");
      return;
    }
    $todo_input.value = ""; //입력창 초기화
    const todo_info = { //텍스트와 id를 저장할 구조체
        text : todo_text,
        id : Date.now() //현재시간으로 id를 주어 각각의 할 일 구분
    };
    add_todo(todo_info); //화면에 표시하는 함수 호출

    todo_storage.push(todo_info); //localstorage 최신화
    refresh_todo();
}

function add_todo(info){ //할 일을 화면에 표시하는 함수(할일,버튼들 추가)

  const list = document.createElement("li"); //li태그 생성
  list.id = info.id; //현재 시간을 id로 설정

  const text = document.createElement("span"); //span태그 생성(줄바꿈 방지를 위해 div대신 사용)
  text.innerText = info.text + " "; //입력받은 텍스트 삽입
  text.addEventListener("click", toggleStrikeThrough); // 텍스트 클릭 시

  const removeButton = document.createElement("button"); //삭제버튼 생성
  removeButton.innerText = "X";
  removeButton.classList.add('remove-button');
  removeButton.addEventListener("click", remove_todo); //삭제버튼 클릭시
  
  const editButton = document.createElement("button"); // 수정버튼 생성
  editButton.textContent = "📝";
  editButton.classList.add('edit-button');
  editButton.addEventListener("click", editTodo); // 수정버튼 클릭 시

  const editInput = document.createElement("input"); //수정버튼 클릭 시 입력창 생성
  editInput.type = "text";
  editInput.classList.add("edit-input");
  editInput.value = info.text;
  editInput.style.display = "none";
  editInput.addEventListener("keydown", handleEditKeydown); // 엔터키 입력 시
  editInput.addEventListener("blur", handleEditBlur); // 입력 창이 아닌 다른 부분 클릭 시

  $todo_list.appendChild(list); //ul태그에 list추가
  list.appendChild(text); //li태그에 텍스트 추가
  list.appendChild(editButton); //li태그에 버튼 추가
  list.appendChild(removeButton); //li태그에 버튼 추가
  list.appendChild(editInput); //li태그에 입력창 추가
}

function refresh_todo(arr){ //localstorage에 최신화 시키기
    localStorage.setItem(K, JSON.stringify(todo_storage));
    //JSON_stringify : 요소를 문자열로 바꿔주는 함수
}

function remove_todo(e){ //일정 삭제하기
    const list = e.target.parentElement; //부모 객체(li 태그) 선택
    list.remove();  //li태그 지우기
    todo_storage = todo_storage.filter((remain) => remain.id !== parseInt(list.id));
    //id가 다른 값(제거할 값)을 빼고 다시 배열 생성해서 저장
    refresh_todo(); //localstorage 새로고침
}


//---------------------------------------------- 민형님
function toggleStrikeThrough(event) {
    // 취소선을 추가하는 함수
    const text = event.target;
    text.classList.toggle("strike-through");
  }
  
  function handleEditKeydown(event) {
    // 편집 모드 중 키다운 이벤트 처리
    if (event.key === "Enter") { // 엔터키
      event.preventDefault();
      const editInput = event.target;
      const list = editInput.parentElement;
      const todoId = parseInt(list.id);
      const todo = todo_storage.find((todo) => todo.id === todoId);
      const newText = editInput.value.trim();
  
      if (newText !== "") {
        todo.text = newText;
        list.querySelector("span").innerText = newText + " ";
        refresh_todo();
      } else {
        remove_todo(list);
      }
  
      editInput.blur(); 
      const editButton = list.querySelector(".edit-button");
      editButton.style.visibility = "visible"; // 수정 버튼 가시화
    } else if (event.key === "Escape") { // esc 키
      cancelEdit(event.target);
    }
  }
  
  function handleEditBlur(event) {
    // 편집 모드 중 블러 이벤트 처리
    cancelEdit(event.target); // 편집 취소
    const list = event.target.parentElement;
    const editButton = list.querySelector(".edit-button");
    editButton.style.visibility = "visible"; // 수정 버튼 가시화
  }
  
  
  function cancelEdit(editInput) {
    const list = editInput.parentElement;
    const text = list.querySelector("span");
  
    text.style.display = "inline";
    editInput.style.display = "none";
  
    const editButton = list.querySelector(".edit-button");
    const removeButton = list.querySelector(".remove-button");
  
    editButton.style.visibility = "visible";
  
    // 삭제 버튼이 사라졌을 경우 버튼을 다시 표시
    if (!editButton.classList.contains("editing")) {
      removeButton.style.visibility = "visible";
    }
  }
  
  function editTodo(event) {
    const list = event.target.parentElement;
    const text = list.querySelector("span");
    const editInput = list.querySelector(".edit-input");
    const editButton = event.target;
  
    if (editInput.style.display === "none") {
      text.style.display = "none";
      editInput.style.display = "inline-block";
      editInput.value = text.innerText.trim();
      editInput.focus();
      editButton.style.visibility = "hidden"; // 수정할 때 수정 버튼 숨기기
      list.querySelector(".remove-button").style.visibility = "hidden"; // 수정할 때 삭제 버튼 숨기기
    } else {
      const newText = editInput.value.trim();
  
      if (newText !== "") {
        const todoId = parseInt(list.id);
        const todo = todo_storage.find((todo) => todo.id === todoId);
        todo.text = newText;
        text.innerText = newText + " ";
        refresh_todo();
      } else {
        remove_todo(list);
      }
  
      cancelEdit(editInput);
      text.style.display = "inline";
      editButton.style.visibility = "visible";
      // 수정 후 삭제 버튼 표시
      list.querySelector(".remove-button").style.visibility = "visible";
    }
}
