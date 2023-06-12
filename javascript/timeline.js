var table = document.getElementById("timetable");
// 초기 상태니 새 배열을 만들어주자
var localArray = []; // 24*2
for (var i = 0; i < 24; i++) {
  var time = i.toString().padStart(2, "0") + ":00"; // 시간을 00:00 형식으로 생성
  localArray.push([time, ""]); // [['00:00', '']['01:00','']...['23:00','']]
}
console.log(localArray);

var startTimeSelect = document.getElementById("startTime");
var endTimeSelect = document.getElementById("endTime");

// 테이블 생성 및 시작 시간, 마감 시간 셀렉트박스 추가
for (var time = 0; time < 24; time++) {
  var row = document.createElement("tr"); // table row
  var timeCell = document.createElement("td"); // 시간 table data

  var timeValue = (time < 10 ? "0" + time : time) + ":" + "00"; //HH:00;
  timeCell.textContent = timeValue;
  timeCell.setAttribute("dataTime", timeValue); // (속성, 속성값)
  row.appendChild(timeCell);

  var contentCell = document.createElement("td"); // 내용 table data
  row.appendChild(contentCell);

  table.appendChild(row);

  // 시작 시간 셀렉트박스 생성
  var selectBoxStart = document.createElement("option");
  selectBoxStart.value = timeValue;
  selectBoxStart.text = timeValue;
  startTimeSelect.appendChild(selectBoxStart); // 21번줄

  // 마감 시간 셀렉트박스 생성
  var selectBoxEnd = document.createElement("option");
  selectBoxEnd.value = timeValue;
  selectBoxEnd.text = timeValue;
  endTimeSelect.appendChild(selectBoxEnd); // 22번줄
}

//구조체에서 불러오기 (재원)
const load_local = localStorage.getItem("todo");
if (load_local) {
  const parsed = JSON.parse(load_local);
  for (let i = 0; i < parsed.length; i++) {
    //구조체에서 값 불러오기
    let text = parsed[i].text;
    let start = parsed[i].start;
    let end = parsed[i].end;
    let interval = parseInt(end) - parseInt(start);
    for (let i = 0; i < 24; i++) {
      if (start == localArray[i][0]) {
        for (let j = i; j < i + interval; j++) {
          localArray[j][1] = text; //배열 내부값 설정하기
        }
      }
    }
  }
  highlightColor();
}
//실행시 삭제 버튼에 타임라인 삭제 이벤트 추가(재원)
var eraseButton = document.querySelectorAll(".remove-button");
eraseButton.forEach((remove) => {
  remove.addEventListener("click", function (e) {
    let ls = localStorage.getItem("todo");
    let arr = JSON.parse(ls);
    const index = arr.findIndex((info) => info.id == e.target.closest("li").id); //삭제하려고 클릭한 todo의 id로 배열 객체의 인덱스 찾기
    remove_timeline(arr[index]); //해당되는 배열로 타임라인 삭제함수 호출

    arr.splice(index, 1);
    localStorage.setItem("todo", JSON.stringify(arr));
  });
});

//실행시 수정버튼에 타임라인 수정 이벤트 추가(재원)
let $edit_input = document.querySelectorAll(".edit-input");
$edit_input.forEach((edit) => {
  edit.addEventListener("keydown", function (e) {
    let ls = localStorage.getItem("todo");
    let arr = JSON.parse(ls);
    let index = arr.findIndex((info) => info.id == e.target.closest("li").id);

    if (e.key === "Enter") {
      let start = arr[index].start;
      let end = arr[index].end;
      let interval = parseInt(end) - parseInt(start);
      let text = arr[index].text;
      let start_index = Number(start.substr(0, 2));
      for (let i = start_index; i < start_index + interval; i++) {
        localArray[i][1] = text;
      }
      var rows = table.getElementsByTagName("tr");
      var contentCell = rows[start_index].getElementsByTagName("td")[1];
      contentCell.textContent = localArray[start_index][1];
    }
  });
});

// 출력 버튼 클릭 시 테이블 영역 강조, 배열 값 변경
const setButton = document.getElementById("todo_form");
const input = document.getElementById("todo_input");
setButton.addEventListener("submit", function () {
  //출력 함수
  var startTime = startTimeSelect.value; // 설정된 시작 시간
  var endTime = endTimeSelect.value; // 설정된 마감 시간
  var ingTime = Math.abs(parseInt(startTime) - parseInt(endTime)); // 진행되는 시간
  var timeContent = input.value; //입력받은 텍스트
  console.log(startTime);
  console.log(endTime);
  console.log(timeContent);
  for (let i = 0; i < 24; i++) {
    if (startTime == localArray[i][0]) {
      //배열의 i값과 시작시간이 같으면
      for (
        let j = i;
        j < i + ingTime;
        j++ // 시작 시간부터 시간 길이(마감-시작)만큼 칠하기
      ) {
        localArray[j][1] = timeContent;
      }
    }
  }
  // 다시 기본값으로 다시 설정
  startTimeSelect.selectedIndex = 0;
  endTimeSelect.selectedIndex = 0;
  document.getElementById("todo_input").value = "";
  highlightColor();

  //삭제버튼에 타임라인 삭제 이벤트 추가(재원)
  eraseButton = document.querySelectorAll(".remove-button");
  eraseButton.forEach((remove) => {
    remove.addEventListener("click", function (e) {
      let ls = localStorage.getItem("todo");
      let arr = JSON.parse(ls);
      let index = arr.findIndex((info) => info.id == e.target.closest("li").id); //삭제하려고 클릭한 todo의 id로 배열 객체의 인덱스 찾기
      remove_timeline(arr[index]); //해당되는 배열로 타임라인 삭제함수 호출

      arr.splice(index, 1);
      localStorage.setItem("todo", JSON.stringify(arr));
    });
  });
  //수정시 타임라인 수정 이벤트 추가(재원)
  $edit_input = document.querySelectorAll(".edit-input");
  $edit_input.forEach((edit) => {
    edit.addEventListener("keydown", function (e) {
      let ls = localStorage.getItem("todo");
      let arr = JSON.parse(ls);
      let index = arr.findIndex((info) => info.id == e.target.closest("li").id);

      if (e.key === "Enter") {
        let start = arr[index].start;
        let end = arr[index].end;
        let interval = parseInt(end) - parseInt(start);
        let text = arr[index].text;
        let start_index = Number(start.substr(0, 2));
        for (let i = start_index; i < start_index + interval; i++) {
          localArray[i][1] = text;
        }
        var rows = table.getElementsByTagName("tr");
        var contentCell = rows[start_index].getElementsByTagName("td")[1];
        contentCell.textContent = localArray[start_index][1];
      }
    });
  });
});

function remove_timeline(info) {
  var startTime = info.start; // 설정된 시작 시간
  var endTime = info.end; // 설정된 마감 시간

  let startTimeNum = Number(startTime.substr(0, 2));
  let endTimeNum = Number(endTime.substr(0, 2));
  let cnt = 0;

  // 색칠된 거 흰색으로 바꿔두기
  // 배열에서 데이터 지우고 그 배열을 다시 ls에 올리기
  var ss = null;
  for (let i = 0; i < 24; i++) {
    if (
      localArray[startTimeNum][1] == localArray[i][1] ||
      localArray[endTimeNum - 1][1] == localArray[i][1]
    ) {
      // 선택한 시간에 걸친 일정이 현재 For문 도는 시간의 일정과 동일한지
      cnt++;
      if (cnt == 1) {
        ss = i;
      } else {
        localArray[i][1] = "";
      }
    } else {
      if (ss == null) {
      } else if (localArray[ss][1] == localArray[i][1]) {
        localArray[i][1] = "";
      }
    }
  }
  localArray[ss][1] = "";

  highlightColor(); // 색칠 영역 갱신시켜버리기
}

function highlightColor() {
  // 일정있음 색칠하기 +++++++ 내용 추가해야지
  var rows = table.getElementsByTagName("tr"); // 테이블 모든 행을 가져왔다

  // console.log("highlightColor",rows, rows.length);
  for (var i = 0; i < rows.length; i++) {
    var contentCell = rows[i].getElementsByTagName("td")[1]; // 현재 행의 두 번째 셀을 가져옴 (내용 셀)
    var rowTime = rows[i]
      .getElementsByTagName("td")[0]
      .getAttribute("dataTime"); // 현재 행의 첫 번째 셀의 dataTime 속성 값을 가져옴 (행의 시간)

    if (localArray[i][1] != "") {
      contentCell.style.backgroundColor = "yellow";
      if (contentCell.textContent != localArray[i - 1][1]) {
      } // 텅 ~
      else {
        contentCell.textContent = localArray[i][1];
      }
    } else {
      contentCell.style.backgroundColor = "white";
    }

    if (contentCell.style.backgroundColor == "white") {
      contentCell.textContent = "";
    }
  }
}
