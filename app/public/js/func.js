var Pjs;

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

function sleep(a) {
    var dt1 = new Date().getTime();
    var dt2 = new Date().getTime();
    while (dt2 < dt1 + a) {
        dt2 = new Date().getTime();
    }
    return;
}

function run() {
    const code = editor.getValue();
    const url_create = "http://api.paiza.io/runners/create";
    let url_get_details = new URL("http://api.paiza.io/runners/get_details");

    let params1 = {
        source_code: code,
        language: 'c',
        input: "",
        api_key: 'guest'
    };
    const query_params1 = new URLSearchParams(params1);

    var options1 = {
        method: "post",
        body: query_params1
    };
    fetch(url_create, options1)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data.id);
            sleep(2000);
            url_get_details.searchParams.set('id', data.id);
            url_get_details.searchParams.set('api_id', 'guest');
        })
        .catch((error) => {
            console.log(error);
        })
        
    alert(url_get_details);
    fetch(url_get_details)
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            console.log(result.stdout);
        })
        .catch((error) => {
            console.log(error);
        })
}
