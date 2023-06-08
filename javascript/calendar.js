 // HTML 요소 선택
 const calendarContainer = document.getElementById('calendar');

 // 달력 생성 함수
 function createCalendar(year, month) 
 {
     // 이전 달의 마지막 날짜
     let prevMonthLastDate = new Date(year, month, 0).getDate();
     // 현재 달의 마지막 날짜
     let currentMonthLastDate = new Date(year, month + 1, 0).getDate();
     // 현재 달의 첫째 날 요일 (0: 일요일, 1: 월요일, ...)
     let currentMonthFirstDay = new Date(year, month, 1).getDay();

     // 달력을 생성할 HTML 문자열
     let calendarHTML = '<table class = "calendar" id = "cal_table">';

     // 달력 헤더 (년, 월)
     calendarHTML += '<thead>';
     calendarHTML += '<tr class = "calendar">';
     calendarHTML += `<th colspan="7">${year}년 ${month + 1}월</th>`;
     calendarHTML += '</tr>';
     calendarHTML += '</thead>';

     // 요일 헤더 (일 ~ 토)
     calendarHTML += '<tr class = "calendar">';
     calendarHTML += '<th>일</th>';
     calendarHTML += '<th>월</th>';
     calendarHTML += '<th>화</th>';
     calendarHTML += '<th>수</th>';
     calendarHTML += '<th>목</th>';
     calendarHTML += '<th>금</th>';
     calendarHTML += '<th>토</th>';
     calendarHTML += '</tr>';

     // 날짜 표시
     calendarHTML += '<tbody>';
     calendarHTML += '<tr class = "calendar">';

     let day = 1; // 날짜 카운트 변수

     // 이전 달의 마지막 주의 날짜들을 표시
     for (let i = currentMonthFirstDay - 1; i >= 0; i--) 
     {
         calendarHTML += `<td class="inactive">${prevMonthLastDate - i}</td>`;
     }

     // 현재 달의 날짜들을 표시
     while (day <= currentMonthLastDate) 
     { 
         if (currentMonthFirstDay % 7 === 0) 
         {
             // 일주일이 끝났을 때 행을 종료하고 다음 행을 시작
             calendarHTML += '</tr><tr class = "calendar">';
         }
         if(day !== new Date().getDate()){
            calendarHTML += `<td>${day}</td>`;
         } else {
            calendarHTML += `<td class="today">${day}</td>` //오늘 날짜에 today 클래스 추가
        }
         day++;
         currentMonthFirstDay++;
         
     }
     
     // 다음 달의 시작 주의 날짜들을 표시
     let next_day = 1;
     while (currentMonthFirstDay % 7 !== 0) 
     {
         console.log("dd?");
         calendarHTML += `<td class="inactive">${next_day}</td>`;
         currentMonthFirstDay++;
         next_day++;
     }
     next_day = 1;
     
     calendarHTML += '</tr>';
     calendarHTML += '</tbody>';
     calendarHTML += '</table>';

     // 달력을 HTML 요소에 삽입
     calendarContainer.innerHTML = calendarHTML;
 }
 // 현재 날짜를 기준으로 달력 생성
 const currentDate = new Date();
 const currentYear = currentDate.getFullYear();
 const currentMonth = currentDate.getMonth();
 createCalendar(currentYear, currentMonth);

 // -------------------------날짜 클릭 추가 (재원)
 const $cal_table = document.querySelector("#cal_table");
 const $today = document.querySelector(".today"); //오늘 날짜를 자동으로 선택
 $today.id = "selected";
 let sel_td = $today; 

 $cal_table.onclick = function(e){ //클릭한 셀이 날짜이면 select_day함수에 전달
    let clicked = e.target;
    //console.log(typeof(clicked));
    if(clicked.tagName != "TD"){    //클릭한 곳이 날짜가 아닐 경우
        console.log("not td");
        return;
    }
    select_day(clicked);
 };
 function select_day(day){ //선택한 날짜에 id를 추가하는 함수(선택한 날짜를 알 수 있게끔...)
    if(sel_td){
        sel_td.removeAttribute("id"); //기존 날짜의 id 제거
    }
    sel_td = day;
    day.id = "selected";
    console.log(day);
}