/**
 * Created by siyu on 2016/3/20.
 */

$("input").click(function(){
    var name = this.name;
    $("input[name=\"" + name + "\"]").removeClass("clicked");
    $(this).addClass("clicked");


    var calcFunc = function(){
        var AVmatrix = {
            Network: 0.85,
            Adjacent: 0.62,
            Local: 0.55,
            Physical: 0.2
        };
        var ACmatrix = {
            Low: 0.77,
            High: 0.44
        };
        var PRmatrix = {
            None: 0.85,
            Low: 0.62,
            High: 0.27
        };
        var PRchanged = {
            None: 0.85,
            Low: 0.68,
            High: 0.5
        };
        var UImatrix = {
            None: 0.85,
            Required: 0.62
        };
        var CIAmatrix = {
            None: 0,
            Low: 0.22,
            High: 0.56
        };
        var MATRIX = {
            AV: AVmatrix,
            AC: ACmatrix,
            PR: PRmatrix,
            UI: UImatrix,
            C: CIAmatrix,
            I: CIAmatrix,
            A: CIAmatrix
        };
        if ($(".clicked").length < 7)
            return 0;

        var getValue = function(dim){
            console.log(dim);
            return $("input[name=\"" + dim + "\"].clicked").val();
        };

        var getScore  = function(dim){
            var name = getValue(dim);
            return MATRIX[dim][name];
        };

        var Impact = 0;
        var Exploitablity = 0;
        var score = 0;
        var ISCbase = 1 - ((1-getScore("C")) * (1-getScore("I")) * (1-getScore("A")));
        if (ISCbase <= 0)
            return 0;

        if (getValue("S") == "Changed") {
            MATRIX['PR'] = PRchanged;
            Exploitablity = 8.22 * getScore("AV") * getScore("AC") * getScore("PR") * getScore("UI");
            Impact = 7.52 * (ISCbase - 0.029) - 3.25 * (Math.pow((ISCbase - 0.02), 15));
            score = 1.08 * (Exploitablity + Impact);
        }
        else
        {
            Exploitablity = 8.22 * getScore("AV") * getScore("AC") * getScore("PR") * getScore("UI");
            Impact = 6.42 * ISCbase;
            score = Exploitablity + Impact;
        }
        if (score > 9.9) return 10;
        return Math.ceil(score*10)/10;


    };
    var cvss = calcFunc();
    console.log(cvss);
    var percentage = cvss * 10;

    $("div.rectangle").stop();
    $("div.rectangle").animate({height:percentage + "%"});

});

