/**
 * Created by siyu on 2016/3/20.
 */

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
    if ($(".clicked").length < 8)
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



$("input").click(function(){
    var name = this.name;
    $("input[name=\"" + name + "\"]").removeClass("clicked");
    $(this).addClass("clicked");

    var cvss = calcFunc();
    console.log(cvss);
    var percentage = cvss * 10;
    $("div.rectangle").stop();
    var lastperct = Math.floor((parseInt($("div.rectangle").css("height")))/7);
    var lastcvss = lastperct / 10;
    //segment animation
    var segments = [0.1, 5, 7, 9];
    var segcolor = ["green", "yellow", "#ff4500", "red", "#8b0000"];
    var segmentperct = ["1%", "50%", "70%", "90%"];
    var seglevel = function(val){
        for (var i = 0; i < 4; i++){
            if (val < segments[i])
                return i;
        }
        return 4;
    };

    $("div.rectangle").animate({height:percentage + "%", backgroundColor: segcolor[seglevel(cvss)]});
    $("div.rectangle h4").text(cvss);
});

var resourcesdict={
    AV: "This metric reflects the context by which vulnerability exploitation is possible. This metric value (and consequently the Base score) will be larger the more remote (logically, and physically) an attacker can be in order to exploit the vulnerable component. The assumption is that the number of potential attackers for a vulnerability that could be exploited from across the Internet is larger than the number of potential attackers that could exploit a vulnerability requiring physical access to a device, and therefore warrants a greater score. The list of possible values is presented in Table 1.",
    AC: "This metric describes the conditions beyond the attacker's control that must exist in order to exploit the vulnerability. As described below, such conditions may require the collection of more information about the target, the presence of certain system configuration settings, or computational exceptions. Importantly, the assessment of this metric excludes any requirements for user interaction in order to exploit the vulnerability (such conditions are captured in the User Interaction metric). This metric value is largest for the least complex attacks. The list of possible values is presented in Table 2.",
    PR: "This metric describes the level of privileges an attacker must possess before successfully exploiting the vulnerability. This metric is greatest if no privileges are required. The list of possible values is presented in Table 3.",
    UI: "This metric captures the requirement for a user, other than the attacker, to participate in the successful compromise of the vulnerable component. This metric determines whether the vulnerability can be exploited solely at the will of the attacker, or whether a separate user (or user-initiated process) must participate in some manner. This metric value is greatest when no user interaction is required. The list of possible values is presented in Table 4.",
    S: "Intuitively, one may think of a scope change as breaking out of a sandbox, and an example would be a vulnerability in a virtual machine that enables an attacker to delete files on the host OS (perhaps even its own VM). In this example, there are two separate authorization authorities: one that defines and enforces privileges for the virtual machine and its users, and one that defines and enforces privileges for the host system within which the virtual machine runs. A scope change would not occur, for example, with a vulnerability in Microsoft Word that allows an attacker to compromise all system files of the host OS, because the same authority enforces privileges of the user's instance of Word, and the host's system files.",
    C: "This metric measures the impact to the confidentiality of the information resources managed by a software component due to a successfully exploited vulnerability. Confidentiality refers to limiting information access and disclosure to only authorized users, as well as preventing access by, or disclosure to, unauthorized ones. The list of possible values is presented in Table 6. This metric value increases with the degree of loss to the impacted component.",
    I: "This metric measures the impact to integrity of a successfully exploited vulnerability. Integrity refers to the trustworthiness and veracity of information. The list of possible values is presented in Table 7. This metric value increases with the consequence to the impacted component.",
    A: "This metric measures the impact to the availability of the impacted component resulting from a successfully exploited vulnerability. While the Confidentiality and Integrity impact metrics apply to the loss of confidentiality or integrity of data (e.g., information, files) used by the impacted component, this metric refers to the loss of availability of the impacted component itself, such as a networked service (e.g., web, database, email). Since availability refers to the accessibility of information resources, attacks that consume network bandwidth, processor cycles, or disk space all impact the availability of an impacted component. The list of possible values is presented in Table 8. This metric value increases with the consequence to the impacted component."
};

$(".exploit-metrics").hover(function(){
    var elem = this.getElementsByTagName("input")[0];
    var metrics = elem.getAttribute("name");
    $(".explanation>h2").text(metrics);
    $(".explanation>p").text(resourcesdict[metrics]);
},function(){
    $(".explanation>h2").text("");
    $(".explanation>p").text("");
});
