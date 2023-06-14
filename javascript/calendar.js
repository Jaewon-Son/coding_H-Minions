let initmonth = new Date(); // 현재 달을 페이지를 로드한 날의 달로 초기화
let today = new Date(); // 페이지를 로드한 날짜를 저장
today.setHours(0, 0, 0, 0); //today 변수에 저장된 날짜와 nowDay 변수에 저장된 날짜를 비교할 때, 시간 요소는 고려되지 않고 날짜만 비교됩니다. 이렇게 비교를 통해 오늘 이전인 경우 "pastDay" 클래스를 할당하여 클릭 가능하도록 설정할 수 있습니다.
// 달력 생성 : 해당 달에 맞춰 테이블을 만들고, 날짜를 채워 넣는다.
Calendar();
function Calendar() {
  let firstdate = new Date(initmonth.getFullYear(), initmonth.getMonth(), 1); // getMonth() 메서드는 0부터 시작하므로 현재 달에 +1을 한 값을 사용하여 다음 달의 0번째 날을 생성하여 이번 달의 마지막 날을 구합니다.
  let lastdate = new Date(initmonth.getFullYear(), initmonth.getMonth() + 1, 0); //예를 들어, 현재가 2023년 5월인 경우 firstDate 변수는 new Date(2023, 4, 1)로 설정되고, lastDate 변수는 new Date(2023, 5, 0)로 설정됩니다.

  let tbodyCalendar = document.querySelector(".Calendar>tbody");
  document.getElementById("thisYear").innerText = initmonth.getFullYear(); // 연도 숫자 갱신
  document.getElementById("thisMonth").innerText = padzero(
    initmonth.getMonth() + 1
  ); // 월 숫자 갱신, padzero는 수는 주어진 값이 한 자리 숫자인 경우 0을 붙여줌

  while (tbodyCalendar.rows.length > 0) {
    tbodyCalendar.deleteRow(tbodyCalendar.rows.length - 1); // 이전 출력결과가 남아있는 경우 초기화
  }
  let firstRow = tbodyCalendar.insertRow(); //첫 번째 행을 추가하는 이유는 달력에서 날짜를 표시할 때 주의 시작 요일에 맞춰서 표시하기 위해서입니다. 첫 번째 행은 이번 달의 첫 날이 시작하는 요일 이전의 빈 칸을 채우는 역할을 합니다. 이후의 날짜는 첫 번째 행에 추가된 열(<td>)에 차례대로 표시됩니다.

  for (let j = 0; j < firstdate.getDay(); j++) {
    let newCell = firstRow.insertCell(); // 새로운 셀(열) 추가
  }
  for (
    thisday = firstdate;
    thisday <= lastdate;
    thisday.setDate(thisday.getDate() + 1)
  ) {
    // day는 날짜를 저장하는 변수, 이번달 마지막날까지 증가시키며 반복
    let newCell = firstRow.insertCell(); // 새 열을 추가하고
    newCell.innerText = padzero(thisday.getDate()); // 추가한 열에 날짜 입력

    if (thisday.getDay() == 0) {
      // 일요일인 경우 글자색 빨강으로
      newCell.style.color = "#DC143C";
    }
    if (thisday.getDay() == 6) {
      // 토요일인 경우 글자색 파랑으로 하고
      newCell.style.color = "#0000CD";
      firstRow = tbodyCalendar.insertRow(); // 새로운 행 추가
    }
    if (thisday < today) {
      // 지난날인 경우
      newCell.className = "pastDay";
      newCell.onclick = function () {
        choosedate(this);
      };
    } else if (
      thisday.getFullYear() == today.getFullYear() &&
      thisday.getMonth() == today.getMonth() &&
      thisday.getDate() == today.getDate()
    ) {
      // 오늘인 경우
      newCell.className = "today";
      newCell.onclick = function () {
        choosedate(this);
      };
    } else {
      // 미래인 경우
      newCell.className = "futureDay";
      newCell.onclick = function () {
        choosedate(this);
      };
    }
  }
}

const $today = document.querySelector(".today"); //오늘 날짜의 객체 가져오기
let sel_td = $today; //현재 날짜를 sel_td변수에 저장(선택 이전의 날짜를 알기 위한 temp)(재원)
sel_td.id = "selected";   //현재 날짜에 selected라는 id 추가(선택한 날짜 구분 가능)(재원)

// 날짜 선택
function choosedate(newCell) {
  if (document.getElementsByClassName("Day")[0]) {
    // 기존에 선택한 날짜가 있으면
    document.getElementsByClassName("Day")[0].classList.remove("Day"); // 해당 날짜의 "Day" class 제거
  }
  newCell.classList.add("Day"); // 선택된 날짜에 "Day" class 추가
  //---------------(재원)
  if(sel_td){
  sel_td.removeAttribute("id"); //기존에 있던 selected id 제거(재원)
  }
  newCell.id = "selected";  //선택한 날짜에  id 추가 (재원)
  sel_td = newCell; //sel_td 변수에 선택한 날짜 추가(재원)
}

// 이전달 버튼 클릭
function prevcalendar() {
  initmonth = new Date(
    initmonth.getFullYear(),
    initmonth.getMonth() - 1,
    initmonth.getDate()
  ); // 현재 달을 1 감소
  Calendar(); // 달력 다시 생성
}
// 다음달 버튼 클릭
function nextcalendar() {
  initmonth = new Date(
    initmonth.getFullYear(),
    initmonth.getMonth() + 1,
    initmonth.getDate()
  ); // 현재 달을 1 증가
  Calendar(); // 달력 다시 생성
}

// input값이 한자리 숫자인 경우 앞에 '0' 붙혀주는 함수
function padzero(value) {
  if (value < 10) {
    value = "0" + value;
    return value;
  }
  return value;
}
