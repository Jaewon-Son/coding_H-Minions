// 창 켰을 때 바로 실행
document.addEventListener("DOMContentLoaded", function()
{
    var table = document.getElementById("timeline");
    var start_time = new Date();
    start_time.setHours(0, 0, 0, 0);
    var end_time = new Date();
    end_time.setDate(end_time.getDate() + 1); // 다음 날로 설정
    end_time.setHours(0, 0, 0, 0);
    var interval = 60 * 60 * 1000; // 1시간을 밀리초로 변환

    
    var localArray = JSON.parse(localStorage.getItem('array')); // ls에 있는 걸 -> 배열로 바꿈
    if(localArray == null) // 초기 상태니 새 배열을 만들어주자
    {
        var array = []; // 24*2
        for (var i = 0; i < 24; i++) 
            {
                var time = i.toString().padStart(2, '0') + ':00'; // 시간을 00:00 형식으로 생성
                array.push([time, '']); // [['00:00', '']['01:00','']...['23:00','']]
            }
        localStorage.setItem('array', JSON.stringify(array)); // ls에 집어넣기
    }
    console.log('localArray: ',localArray);
   // console.log(typeof(localArray[0], localArray[0][0], localArray[0][1]));

    var startTimeSelect = document.getElementById("startTime");
    var endTimeSelect = document.getElementById("endTime");

    // 테이블 생성 및 시작 시간, 마감 시간 셀렉트박스 추가
    for (var time = start_time.getTime(); time < end_time.getTime(); time += interval) 
        {
            var row = document.createElement("tr"); // table row

            var hours = new Date(time).getHours();
            var minutes = new Date(time).getMinutes();

            var timeCell = document.createElement("td"); // 시간 table data

            var timeValue = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes); //nn:00;
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

    // 출력 버튼 클릭 시 테이블 영역 강조, 배열 값 변경
    var setButton = document.getElementById("setButton");
    setButton.addEventListener("click", function() 
        {
            var startTime = startTimeSelect.value; // 설정된 시작 시간
            var endTime = endTimeSelect.value; // 설정된 마감 시간
            var ingTime = Math.abs(parseInt(startTime) - parseInt(endTime)); // 진행되는 시간
            var timeContent = document.getElementById("contentInput").value;

            // console.log("시작 시간:", startTime);
            // console.log("마감 시간:", endTime);
            // console.log("diff", ingTime);
            // console.log("텍스트 내용:", timeContent);
            
            //배열 값 변경하는 코드가 갑자기 생각이 안 나요
            for(let i = 0; i < 24; i++)
                {
                    if(startTime == localArray[i][0])
                        {
                            for(let j = i; j < i+ ingTime; j++) // 시작시간과 마감시간 사이에 데이터 채우깅
                                {
                                    localArray[j][1] = timeContent; 
                                }
                            console.log('localArray: ',localArray);
                            localStorage.clear(); // ls 비우기
                            localStorage.setItem('array', JSON.stringify(localArray));
                        }
                }
            // 다시 기본값으로 다시 설정
            startTimeSelect.selectedIndex = 0;
            endTimeSelect.selectedIndex = 0;
            document.getElementById("contentInput").value = "";
            highlightColor();
        }
        );
    
    // 일정 삭제 할겨 // 색칠된 거 지우고, 배열에서 데이터도 지우기 ls 포함
    var eraseButton = document.getElementById("eraseButton");
    eraseButton.addEventListener("click", function()
    {
        var startTime = startTimeSelect.value; // 설정된 시작 시간
        var endTime = endTimeSelect.value; // 설정된 마감 시간
        var ingTime = Math.abs(parseInt(startTime) - parseInt(endTime)); // 진행되는 시간
        var timeContent = document.getElementById("contentInput").value;


        console.log("시작 시간:", startTime);
        console.log("마감 시간:", endTime);
        console.log("diff", ingTime);

        //startTimeText = parseInt(startTime);

        let startTimeNum = Number(startTime.substr(0,2));
        let endTimeNum = Number(endTime.substr(0,2));
        //console.log(localArray[startTimeNum][1], localArray[endTimeNum-1][1] );
        let cnt = 0;


        // 색칠된 거 흰색으로 바꿔두기
        // 배열에서 데이터 지우고 그 배열을 다시 ls에 올리기
        var ss = null;
        for(let i = 0; i < 24; i++)
            {
                if(localArray[startTimeNum][1]== localArray[i][1] || localArray[endTimeNum-1][1] == localArray[i][1]) // 선택한 시간에 걸친 일정이 현재 For문 도는 시간의 일정과 동일한지
                {   
                    cnt++;
                    if(cnt == 1)
                        {
                            ss = i;
                            // if(cnt2 != 0)
                            // {
                            //     localArray[ss][i] = '';
                            // }
                        }
                    //else if(cnt == )
                    else
                    {
                        console.log("test ", i);
                        //deleteContent = localArray[i][1]
                        localArray[i][1] = '';
                        localStorage.clear();
                        localStorage.setItem('array', JSON.stringify(localArray));
                    }
                }
                else
                {
                    if(ss == null)
                    {
                        console.log("testtt:",i);
                    }
                    else if(localArray[ss][1] == localArray[i][1])
                    {
                        localArray[i][1] = '';
                        localStorage.clear();
                        localStorage.setItem('array', JSON.stringify(localArray));
                    }
                        console.log("ewarstdyfdrseawtrsdyjf",i);
                    //}
                    
                }
                // if(startTime == localArray[i][0])
                //         {
                //             for(let j = i; j < i+ ingTime; j++) // 시작시간과 마감시간 사이에 데이터 채우깅
                //                 {
                //                     localArray[j][1] = '';
                //                 }
                //                 console.log('localArray: ',localArray);
                //                 localStorage.clear();
                //                 localStorage.setItem('array', JSON.stringify(localArray));
                //         }
            }
        console.log("111111localArray",localArray);
        localArray[ss][1] = '';
        localStorage.clear();
        localStorage.setItem('array', JSON.stringify(localArray));
        console.log("22222localArray",localArray);
            

        // console.log("localArray",localArray);
        // console.log("localStorage",localStorage);

        // 다시 기본값으로 다시 설정
        startTimeSelect.selectedIndex = 0;
        endTimeSelect.selectedIndex = 0;
        document.getElementById("contentInput").value = "";
        

        highlightColor(); // 색칠 영역 갱신시켜버리기 
            }
    );

        highlightColor(); // 애초에 창 켰을 때 색칠되어야 할 건 색칠해야 하니까..

        function highlightColor() // 일정있음 색칠하기 +++++++ 내용 추가해야지
            {
                var rows = table.getElementsByTagName("tr"); // 테이블 모든 행을 가져왔다

                // console.log("highlightColor",rows, rows.length);
                for (var i = 0; i < rows.length; i++)
                    {
                        var contentCell = rows[i].getElementsByTagName("td")[1]; // 현재 행의 두 번째 셀을 가져옴 (내용 셀)
                        var rowTime = rows[i].getElementsByTagName("td")[0].getAttribute("dataTime"); // 현재 행의 첫 번째 셀의 dataTime 속성 값을 가져옴 (행의 시간)

                        if(localArray[i][1] != '')
                            {
                                contentCell.style.backgroundColor = "yellow";
                                if(contentCell.textContent != localArray[i-1][1])
                                {} // 텅 ~
                                else
                                {
                                    contentCell.textContent = localArray[i][1];
                                }
                            }
                        else
                            {
                                contentCell.style.backgroundColor = "white";
                            }

                        if(contentCell.style.backgroundColor == "white")
                        {
                            contentCell.textContent = ''
                        }
                    }
            }
}
);