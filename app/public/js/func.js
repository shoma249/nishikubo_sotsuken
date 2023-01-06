var Pjs;

// processing言語用関数
function stop() { // not work
    if (Pjs)
        Pjs.exit();
}
function crun() {
    //console.log("Run");
    stop();
    var canvas = document.getElementById('canvas0');
    var code = editor.getValue(); //aceエディタに入力したコードを取得
    //console.log(code);
    try {
        Pjs = new Processing(canvas, code);
        //console.log(Pjs);
    } catch (e) {
        alert(e);
    }
}

// sleep関数
function sleep(a) {
    var dt1 = new Date().getTime();
    var dt2 = new Date().getTime();
    while (dt2 < dt1 + a) {
        dt2 = new Date().getTime();
    }
    return;
}

// paiza.ioのapiを使用したコンパイル関数
const language = ["c", "cpp", "java", "go", "rust", "swift", "objective-c", "kotlin", "scala", "python", "ruby", "php", "javascript", "typescript"];

async function compile(code, lang, input) {
    var params = {
        source_code: code,
        language: language[lang],
        input: input,
        api_key: 'guest'
    };
    const query_params = new URLSearchParams(params);
    const options = {
        method: "post",
        body: query_params
    };

    // api、post_create送信&ID取得
    const res_create = await fetch("http://api.paiza.io/runners/create", options);
    const res_create_json = await res_create.json();
    console.log(res_create_json.id);

    // api、get_status取得
    url = "http://api.paiza.io/runners/get_status?id=" + res_create_json.id + "&api_key=guest";

    do {
        sleep(1000);
        var res_get_status = await fetch(url);
        var res_get_status_json = await res_get_status.json();
    } while (res_get_status_json.status == "running");

    // api、get_details取得
    url = "http://api.paiza.io/runners/get_details?id=" + res_create_json.id + "&api_key=guest";
    const res_get_details = await fetch(url);
    const res_get_details_json = await res_get_details.json();
    let result = '';
    if(lang >= 0 && lang <= 8){
        if (res_get_details_json.build_result == 'success') {
            result = res_get_details_json.stdout;
        } else {
            result = res_get_details_json.build_stderr;
        }
    }else{
        if(res_get_details_json.result == 'success'){
            result = res_get_details_json.stdout;
        }else{
            result = res_get_details_json.stderr;
        }
    }
    
    return result;
}

// ジャッジ関数
async function judge(code, lang, question) {
    let judge = 1;

    for (let i = 0; i < question.testNum; i++) {
        let result = await compile(code, lang, question.input[i]);
        if (result != question.answer[i]) {
            judge = 0;
            break;
        }
    }

    return judge;
}