function readCode(blockNumber, codeNumber) {
    //코드 타입 확인
    var type = $("#codeNumber" + blockNumber + "_" + codeNumber).find("input")[0].value;    //코드를 불러온다
    if (type == 0) {
        var code = $("#codeNumber" + blockNumber + "_" + codeNumber).find("span")[0].innerText;
        var haveEqual = code.split("=");
        if (haveEqual.length != 1) {    //등호가 있는 경우
            var slice = code.indexOf("=");
            var temp = code.subString(0, slice);
            var temp_value = computeToInput(code.subString(slice)); //메소드를 이용하여 뒤의 값들 연산
            temp = temp.trim(); //좌우 공백제거
            var lastChar = temp.subString(temp.length-1);   //가장 오른쪽 문자를 임시로 가져옴
            if(lastChar == "+" || lastChar == "-" || lastChar == "*" || lastChar == "/" || lastChar == "%"){    //연산자 유무 확인
                temp = temp.replace(lastChar, "");  //왼쪽 항에서 연산자를 삭제
                temp = temp.temp.trim();
                temp_value = computeToInput(temp+lastChar+temp_value);  //다시 계산을 수행하여 임시 저장소에 덮어쓰기
            }
            var token = code.split(" ");
            if(token.length > 1) {
                code = makeVariable(code);
                if(code == null) return null;   //에러
            }
            setVariable(code, temp_value);
            return temp_value;
        } else {  //등호가 없는 경우
            var token = code.split(" ");
            if (token.length > 1) {    //처음 선언하는 경우(앞에 타입이 있음)
                makeVariable(code);
            }else{
				code = code.replaceAll(" ",""); // 공백 제거
				var dot = code.split(".");
				if(dot.length>1){
					for(var i=1; i<dot.length; i++){
						if(dot[i].indexOf("(")>=0){
							document.write("메소드 처리");
						}
						else{
							document.write("필드");
						}
					}
				}
				if(code.indexOf("[")>=0){
					var brac_count = 0;
                    var brac_index = 0;
                    var arr_index2 = -1; // -1이 아닌 경우에는 2차원 배열이라는 뜻.
                    var ex_name = code.subString(0, code.indexOf("["));
                    ex_name = ex_name.replaceAll("+", "");
                    ex_name = ex_name.replaceAll("-", "");
                    // 배열의 이름 임시 저장.

                    for(var i =0; i<code.length; i++){
                        if(code.charAt(i)=="["){
                            brac_count ++;
                        }
                        else if(code.charAt(i)== "]"){
                            brac_count --;
                        }
                        if(count == 0){
                            brac_index = i;
                            // ]의 인덱스 찾기
                        }
                    }
                      
                    var arr_index = code.subString(code.indexOf("[")+1, brac_index);
                    // []안에 있는 값 arr_index 변수에 저장
                    code = code.replace(arr_index, "");
                    code = code.replace("[", "");
                    code = code.replace("]", "");
                    // [N] 형태 제거하여 code에 저장
                    arr_index = readCode(arr_index); // 함수로 다시보내 처리하도록 함.
                    if((returnType(ex_name)/10)>1){
                        // 2차원 배열이라는 뜻.
                        // [] 안의 값을 한 번 더 얻어와 연산을 수행.
                        for(var i =0; i<code.length; i++){
                            if(code.charAt(i)=="["){
                                brac_count ++;
                            }
                            else if(code.charAt(i)== "]"){
                                brac_count --;
                            }
                            if(count == 0){
                                brac_index = i;
                                // ]의 인덱스 찾기
                            }
                        }
                          
                        var arr_index2 = code.subString(code.indexOf("[")+1, brac_index);
                        // []안에 있는 값 arr_index2 변수에 저장
                        code = code.replace(arr_index, "");
                        code = code.replace("[", "");
                        code = code.replace("]", "");
                        // [N] 형태 또 제거하여 code에 저장
                        arr_index2 = readCode(arr_index2); // 함수로 다시보내 처리하도록 함.
                    }

                    var charF = code.charAt(0);
                    var charL = code.charAt(code.length-2);
                    code = code.replaceAll("+","");
                    code = code.replaceAll("-","");

                    var _name = code.replace(";","");

                    if(charF == "+" || charL == "+"){
                        if(arr_index2>0){
                            // 2차원 배열이라는 뜻
                            setDoubleArray(_name, arr_index, arr_index2, returnDoubleArray(_name, arr_index, arr_index2)+1);
                        }
                        setArray(_name, arr_index, returnArray(_name, arr_index)+1);

                    }
                    else if(charF == "-" || charL == "-"){
                        if(arr_index2>0){
                            // 2차원 배열이라는 뜻
                            setDoubleArray(_name, arr_index, arr_index2, returnDoubleArray(_name, arr_index, arr_index2)-1);
                        }
                        setArray(_name, arr_index, returnArray(_name, arr_index)-1);
                    }
				}
				else{
					var charF = code.charAt(0);
					var charL = code.charAt(code.length-2);
					// 문자열 앞 뒤 문자 임시 저장
					code = code.replaceAll("+","");
					code = code.replaceAll("-","");
					// 두 가지 연산자에 대해서 코드 줄에서 모두 제거
					var _name = code.replace(";","");
					// 변수 이름 _name
					createVariable(); // 변수 생성
					if(charF == "+" || charL == "+"){
						// _name.setValue(_name.returnValue() +1); 값을 갖고와서 1을 증가시켜 새로 설정. _name은 변수의 이름
					}
					else if(charF == "-" || charL == "-"){
						// _name.setValue(_name.returnValue() -1); 값을 갖고와서 1을 감소시켜 새로 설정. _name은 변수의 이름
					} 
				}
			}

        }
    }
    return null;
}
function makeVariable(code){   //타입이 저장되어 있는 문자열의 경우 
    var token = code.split(" ");
    var type = -1;  //타입에 대한 정보
    var typeString = "";    //타입의 문자열
    //여기서부터 타입 확인하는 부분
    if (token[0].includes("int")) {
        type = 0;
        typeString += "int";
    } else if (token[0].includes("long")) {
        type = 0;
        typeString += "long";
    } else if (token[0].includes("float")) {
        type = 1;
        typeString += "float";
    } else if (token[0].includes("double")) {
        type = 1;
        typeString += "double";
    } else if (token[0].includes("bool")) {
        type = 2;
        typeString += "bool";
    } else if (token[0].includes("boolean")) {
        type = 2;
        typeString += "boolean";
    } else if (token[0].includes("char")) {
        type = 3;
        typeString += "char";
    }else if(token[0]=='new'){//자료형이 나와있지 않은 경우(이미 선언되어있거나 메소드 호출)
    document.write("error");
    }
    if (type >= 0) {	//타입 판단 성공 시
        code.replaceAll(" ", "");	//공백 제거
        code.replace(typeString, "");	//타입 문자열 제거
        while (code.indexOf("[") != -1) {                   //1-19 오타 수정
            type += 10;
            var temp = code.indexOf("[");                   //1-19 오타 수정
            var front = code.subString(0, temp);
            var last = code.subString(temp + 2);
            code = front + last;
        }
        if(type<10) createVariable(code.replace(";", ""), type);	//id, type 순으로 기입
        else if(type<20) createArray(code.replace)
        return code.replace(";", "");
    }
    return null;
}