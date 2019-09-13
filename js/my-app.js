Template7.registerHelper('stringify', function (context){
    var str = totalStringify(context);
    // Need to replace any single quotes in the data with the HTML char to avoid string being cut short
    return str.split("'").join('&#39;');
});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
var isAjaxLoaded=false;
var isAjaxLoadedLoop=false;
var pathToAjaxDispatcher="https://www.laughsterapp.com/php/ajaxDispatcher1.php";
var pathToJSTemplates="js/templates/";

var GOOGLE_MAPS_STATIC_V3_API_KEY;

var currentLocation=false;

var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'Laughsterapp',
  // App id
  id: 'com.myapp.test',
  cache: false,
  cacheDuration: 0, /* set caching expire time to 0 */
  routes: [
        {
            name: 'events',
            path: '/events/',
            componentUrl: pathToJSTemplates + 'events.htm'
        },
        {
            name: 'eventdetails',
            path: '/eventdetails/',
            componentUrl: pathToJSTemplates + 'eventDetails.htm'
        },
        {
            name: 'social',
            path: '/social/',
            componentUrl: pathToJSTemplates + 'social.htm'
        },
        {
            name: 'biography',
            path: '/bio/',
            componentUrl: pathToJSTemplates + 'biography.htm'
        },
        {
            name: 'news',
            path: '/news/',
            componentUrl: pathToJSTemplates + 'news.htm'
        },
        {
            name: 'videos',
            path: '/videos/',
            componentUrl: pathToJSTemplates + 'videos.htm'
        },
        {
            name: 'videodetails',
            path: '/videodetails/',
            componentUrl: pathToJSTemplates + 'videoDetails.htm'
        },
        {
            name: 'podcasts',
            path: '/podcasts/',
            componentUrl: pathToJSTemplates + 'podcasts.htm'
        },
        {
            name: 'gallery',
            path: '/gallery/',
            componentUrl: pathToJSTemplates + 'gallery.htm'
        },
        {
            name: 'gallerydetails',
            path: '/gallerydetails/',
            componentUrl: pathToJSTemplates + 'galleryDetails.htm'
        }
  ],
  on: {
    init: function () {
        //Get current device location
        readTextFile('laughsterapp.txt', 'getJSON');
        
    },
    pageInit: function (page) {
        if(page.name==='home'){
            var appID=$$("input[name='appID']").val();
            if(localStorage.getItem("userAPPInfo")!==null){
                var allComedianData=JSON.parse(localStorage.getItem("userAPPInfo"));
                if(typeof(allComedianData)=="object"){
                    if(typeof(allComedianData[appID])!=="undefined"){
                        var simpleComedian=allComedianData[appID];
                        //Check is this user already registered to this comedian Application
                        if(typeof(simpleComedian["userAPPID"])!=="undefined"){
                            var userAPPID=simpleComedian["userAPPID"];
                            if(parseInt(userAPPID)>0){
                                loadComedian();
                                return false;
                            }
                        }
                    }
                }
            }
            
            getCurrentLocation();
        }
    },
  },
  view: {
      iosDynamicNavbar: false
  }
});


// Compile templates once on app load/init
readTextFile(pathToJSTemplates + "welcomeTemplate.htm", "compileTemplate");
var welcomeTemplate;
var compiledWelcomeTemplate;

// Compile templates once on app load/init
readTextFile(pathToJSTemplates + "navbarTemplate.htm", "compileNavbarTemplate");
var navbarTemplate;
var compiledNavbarTemplate;

// Compile templates once on app load/init
readTextFile(pathToJSTemplates + "navbarTemplateDetails.htm", "compileNavbarTemplateDetails");
var navbarTemplateDetails;
var compiledNavbarTemplateDetails;



// Add view
var mainView = app.views.create('.view-main');

var isCordovaApp = document.URL.indexOf('http://') === -1
  && document.URL.indexOf('https://') === -1;

$$(document).on('deviceready', function(){
    
    if(isCordovaApp) { 

    }else{

    }
 });
 
 $$.fn.setCustomValidityFormTranslations=function(){
    return this.each(function(){
        var $this=$$(this);
        $this.find("input[type=text], input[type=email], input[type=url], input[type=password], input[type=radio], input[type=checkbox], textarea, select").on('change invalid', function() {
            var textfield = $$(this)[0];
            var customMessage=textfield.getAttribute("data-validity-title");
            if(customMessage=="" || customMessage==null){
                customMessage="Please fill this field";
            }

            // 'setCustomValidity not only sets the message, but also marks
            // the field as invalid. In order to see whether the field really is
            // invalid, we have to remove the message first
            textfield.setCustomValidity('');

            if (!textfield.validity.valid) {
              textfield.setCustomValidity(customMessage); 
              $$(this).addClass("shake missingField");
            }
        });
    });
};
 
 $$.fn.wrapAudioPlayers = function(){
     return this.each(function(){
        var $this=$$(this);
        var src=$this.attr("data-src");
        var srcType=$this.attr("data-sourcetype");
        var player=$this.find("audio")[0];
        var controls=$this.find("div.wrap-custom-player-controls");
        var btn=controls.find("div.buttons");
        var playBtn=controls.find("div.wrap-custom-player-playbutton");
        var pauseBtn=controls.find("div.wrap-custom-player-pausebutton");
        var progressBg=controls.find("div.wrap-custom-player-loader-bg");
        var progressBar=progressBg.find("div.wrap-custom-player-progress-bar");
        var progressTime=controls.find("div.wrap-custom-player-progress-time");
        var isPlaying = false;
        
        var currentIndex=$this.closest(".singleItem").index();
        
        goAction(controls);
        
        function goAction(){
            btn.click(function(){
                togglePlay();
            });
        }
        
        function togglePlay() {
            if (player.paused === false) {
                player.pause();
                isPlaying = false;
                btn.removeClass('paused');

            } else {
               stopAllActivePlayers(currentIndex);
                player.play();
                btn.addClass('paused preloader-in-act');
                isPlaying = true;
            }
        }
    });
 };
 
 $$.fn.activatedOneByOne = function(item, whatClass){
    return this.each(function(){
        var $this=$$(this);
        $$($this).find(item).each(function(i){
            var row = $$(this);
            setTimeout(function() {
                row.addClass(whatClass);
            }, 100*i);
        });
  
    });  
};
 
 var DP = (typeof DP === "object") ? DP : {};

$$.fn.checkFields = function(){
    var formName=$$(this).attr("id");
    var $this=$$(this);
    switch(formName){
        default:
        var vl = new DP.validateForm();
        vl.valSetting = {fields : []};
        
        if($this.find("[required]").length>0){
               $this.find("[required]").each(function(){
                   var whatTypeCheckVS="";
                   if($$(this).attr("type")=="email"){
                       whatTypeCheckVS="email";
                   }
                    vl.valSetting.fields.push(
                    {id : $$(this).attr("name"), val : "", msg : $$(this).attr("placeholder"), type : whatTypeCheckVS});
               });
            }
        return vl.runCheck(formName);
        break;
    }
};

DP.validateForm = function(){
    //generic check value method
    var formValidated = function(whatForm){	
        if(typeof(whatForm)!="undefined"){
                isfrmAddEditUserSubmit=true;
                 whatForm.submit();	
                 return true;
        }
    };
	
    var fromReset = function(elmId, wrongValue, messageText){
        //reset
        $$(".from_wrp input").css({"border":"1px solid #ACA69F"});
        $$(".from_wrp select").css({"border":"1px solid #ACA69F"});
        $$("#error_messages").empty("");
    }

    //generic check value method
    var valueCheck = function(elmId, wrongValue, messageText){
        if($$("[name='" + elmId + "']").val() == wrongValue){
            createAlert(elmId, messageText);
			return false;
		}
			removeAlert(elmId);
			return true;
    };
    
    //alert method
    var createAlert = function(elmId, messageText){
		elmId.addClass("missingField");
        stringAlert +="<p>" + messageText + "</p>";
    };
    var removeAlert = function(elmId){
            elmId.removeClass("missingField");
    };

    //zip validation
    var isZip = function(s){
        var reZip = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
        if (!reZip.test(s)) {
            return false;
        }
        return true;
    };
    
    //checks if value is integer
    var isInt = function(n){
        var reInt = new RegExp(/^\d+$/);
        if (!reInt.test(n)) {
            return false;
        }
        return true;
    };
    
    //checks if value is pin
    var isPin = function(n){
        var rePin = new RegExp(/^\w{4,8}$/);
        if (!rePin.test(n)) {
            return false;
        }
        return true;
    };
    
    //checks if value is pin2
    var isPin2 = function(n){
        var rePin2 = new RegExp(/^\w{8,24}$/);
        if (!rePin2.test(n)) {
            return false;
        }
        return true;
    };
	//checks if value is integer
    var isPrice = function(n){
        var rePrice = new RegExp(/^\d+($|\,\d{3}($|\.\d{1,2}$)|\.\d{1,2}$)/);
        if (!rePrice.test(n)) {
            return false;
        }
        return true;
    };
	
	//mail validation
    var isMail = function(s, elmId){
        var reMail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!reMail.test(s)) {
            return false;
        }		
        return true;
    };
    
    	//checks if value is password
    var isPassword = function(n){
        var rePassword = new RegExp(/^[\w!!?]{6,18}$/);
        if (!rePassword.test(n)) {
            return false;
        }
        return true;
    };
    
    
    //public method checks fieds
    //requires 'valSetting' setting object
	
    this.runCheck = function(whatForm){
        //reseet form		
        //run checks
		var countTrueFilled=0;
		
		stringAlert="";
        for (i=0;i<this.valSetting.fields.length;i++){
			var fName=this.valSetting.fields[i].id;
			var fVal=this.valSetting.fields[i].val;
			var fieldName=$$("#"+whatForm+" [name='" + this.valSetting.fields[i].id + "']");
                        var fMessage=this.valSetting.fields[i].msg==""?fieldName.closest("div").find("label").text():this.valSetting.fields[i].msg;
            
            if(this.valSetting.fields[i].type == "zip"){
                //zip check
                if(isZip(fieldName.val()) == false){    
                    createAlert(fieldName, this.valSetting.fields[i].msg);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }
            else if (this.valSetting.fields[i].type == "number"){
                //checks for number
                if(isInt(fieldName.val()) == false || fieldName.val()==fVal){    
                    createAlert(fieldName, fMessage);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }
			else if (this.valSetting.fields[i].type == "price"){
                //checks for number
                if(isPrice(fieldName.val()) == false){    
                    createAlert(fieldName, fMessage);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }else if (this.valSetting.fields[i].type == "pin"){
                //checks for number
                if(isPin(fieldName.val()) == false){    
                    createAlert(fieldName, fMessage);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }else if (this.valSetting.fields[i].type == "pin2"){
                //checks for number
                if(isPin2(fieldName.val()) == false){    
                    createAlert(fieldName, fMessage);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }else if (this.valSetting.fields[i].type == "password"){
                //checks for number
                if(isPassword(fieldName.val(), fName) === false){ 
                    createAlert(fieldName, fMessage);
                }
				else{
                                    if(fName=='aEOE_passwordagain'){
                                        if(fieldName.val()!=$$("#"+whatForm+ " [name='aEOE_password']").val()) createAlert(fieldName, "Passwords must match.");
                                        else{
                                           removeAlert(fieldName);
                                            countTrueFilled++; 
                                        }
                                    }else{
                                        removeAlert(fieldName);
                                        countTrueFilled++;
                                    }
					
				}
            }
			else if (this.valSetting.fields[i].type == "email"){
                //checks for number
                if(isMail(fieldName.val(), fName) == false){    
                    createAlert(fieldName, fMessage);
                }
				else{
					removeAlert(fieldName);
					countTrueFilled++;
				}
            }
            else{
                //checks for value
                if(fieldName.val()==fVal){
                    createAlert(fieldName, fMessage);
                }else{
                    removeAlert(fieldName);
                    countTrueFilled++;
		}
            }
        }
                console.log(countTrueFilled + " >= " + this.valSetting.fields.length);
		if(countTrueFilled>=this.valSetting.fields.length){
			switch(whatForm){
				default:
                                    $$("#"+whatForm + " div[data-target='ifwrong']").addClass("hidden");
                                    if(isAjaxLoaded) return false;
                                    isAjaxLoaded=true;
                                    var postData=app.form.convertToData("#"+whatForm);
                                    switch(whatForm){
                                        case "frmRegisterAPPUserFE":
                                            switch($$("#"+whatForm + " input[name='context']").val()){
                                                case "registerAPPUserFEStep1":
                                                    isAjaxLoaded=false;
                                                    $$("a[href='#tab-2']").click();
                                                    return false;
                                                break;
                                                case "registerAPPUserFEStep4":
                                                    isAjaxLoaded=false;
                                                    $$("#"+whatForm + " input[name='context']").val("registerAPPUserFE");
                                                    $$("#"+whatForm).find("#tab-3").find("input.mf-input, select.mf-select").attr("required", "required");
                                                    $$("a[href='#tab-3']").click();
                                                    return false;
                                                break;
                                            }
                                        break;
                                    }
                                    
                                    
                                    app.request.post(
                                        pathToAjaxDispatcher, 
                                        postData, 
                                        function(data){
                                            isAjaxLoaded=false;
                                            if(data["success"]==1){
                                                switch(whatForm){
                                                    case "frmRegisterAPPUserFE":
                                                        var appID=$$("input[name='appID']").val();
                                                        var tempObj={};
                                                        tempObj.userappid=data["userappid"];
                                                        $$("input[name='userAPPID']").val(data["userappid"]);
                                                        
                                                        if(localStorage.getItem("userAPPInfo")!==null){
                                                            var allComedians=JSON.parse(localStorage.getItem("userAPPInfo"));
                                                            if(typeof(allComedians)==="object"){
                                                                var simpleComedian=allComedians[appID];
                                                                if(typeof(simpleComedian)==="object"){
                                                                    simpleComedian["userAPPID"]=data["userappid"];
                                                                    allComedians[appID]=simpleComedian;
                                                                    localStorage.setItem("userAPPInfo", totalStringify(allComedians));
                                                                    var obj={};
                                                                    obj.comedian=simpleComedian.comedian;
                                                                    var html=compiledWelcomeTemplate(obj);
                                                                    $$('#replaceWithWelcomeContent').html(html);
                                                                }
                                                            }
                                                        }
                                                        
                                                        //display comedian dashboard
                                                        $$("div[data-target='welcomeTemplate']").removeClass("hidden");
                                                        $$("#app").addClass("permissions-granted")
                                                        $$("a[href='#tab-dashboard']").click();
                                                    break;
                                                }
                                            }else{
                                                dynamicPopup.emit('open-custom', data["message"]);
                                            }
                                        }, function(xhr, status){
                                            isAjaxLoaded=false;
                                            console.log(status);
                                        },
                                        "json"
                                    );
				break;
			}
		}else{
                    switch(whatForm){
                        default:
                            
                        break;
                        case "frmRegisterAPPUserFE":
                            $$("#"+whatForm + " div[data-target='ifwrong']").removeClass("hidden");
                        break;
                    }
                    
                    return false;
		}
		
    };
	
	
};

 $$(document).on("click", "a[data-action='trackclicks'], button[data-action='trackclicks']", function(e){
     var $this=$$(this);
     var currentContext=$this.attr("data-context");
     var postData={context: $this.attr("data-context")};
     var appID=$$("input[name='appID']").val();
     var userAPPIDCurrent=$$("input[name='userAPPID']").val();
     if(appID!==null && appID!==""){
        postData["appid"]=appID;
        if($this.attr("data-socialbutton")){
            postData["socialbutton"]=$this.attr("data-socialbutton");
        }
        if($this.attr("data-etype")){
            postData["etype"]=$this.attr("data-etype");
        }
        if($this.attr("data-id")){
            postData["id"]=$this.attr("data-id");
        }
        if(localStorage.getItem("userAPPInfo")!==null){
            var allComedianData=JSON.parse(localStorage.getItem("userAPPInfo"));
            if(typeof(allComedianData)=="object"){
                var simpleComedian=allComedianData[appID];
                if(typeof(simpleComedian["userAPPID"])!=="undefined"){
                    var userAPPID=simpleComedian["userAPPID"];
                    if(userAPPID===userAPPIDCurrent){
                        postData["userappid"]=userAPPID;
                        sendAjaxOnFly(postData, null, null);
                    }
                }
            }
        }
     }
 });
 
 $$(document).on("click", "a[data-action='addedititem'], button[data-action='addedititem']", function(e){
    e.preventDefault();
    var $this=$$(this);
    var currentContext=$this.attr("data-context");
    
    var postData={context: $this.attr("data-context")};
    
    if($this.attr("data-id")){
        postData["id"]=$this.attr("data-id");
    }
    if($this.attr("data-target-tab")){
        postData["target-tab"]=$this.attr("data-target-tab");
    }
    if($this.attr("data-etype")){
        postData["etype"]=$this.attr("data-etype");
    }
    
    switch(postData["context"]){
        case "collectAPPUserData":
            if(postData["target-tab"]=="#tab-4"){
                $$(postData["target-tab"]).closest("form").find("input[name='context']").val("registerAPPUserFEStep4");
                $$(postData["target-tab"]).find("input.mf-input, select.mf-select").attr("required", "required");
            }else if(postData["target-tab"]=="#tab-3"){
                $$(postData["target-tab"]).closest("form").find("input[name='context']").val("registerAPPUserFE");
                $$(postData["target-tab"]).find("input.mf-input, select.mf-select").attr("required", "required");
            }
            $$("a[href='" + postData["target-tab"] + "']").click();
        break;
        case "firstTimeNotificationGot":
            //mark this section as viewed
            var tempObject={etype: 1};
            if(localStorage.getItem("userAPPFirstTime")===null){
                localStorage.setItem("userAPPFirstTime", totalStringify(tempObject));
            }else{
                var allClicks=JSON.parse(localStorage.getItem("userAPPFirstTime"));
                if(typeof(allClicks)==="object"){
                    allClicks[postData["etype"]]=1;
                    localStorage.setItem("userAPPFirstTime", totalStringify(allClicks));
                }
            }
            hideFirstTimeNotification();
        break;
        case "rsvpEvent":
            var appID=$$("input[name='appID']").val();
            var userAPPIDCurrent=$$("input[name='userAPPID']").val();
            if(appID!==null && appID!==""){
                postData["appid"]=appID;
                if(localStorage.getItem("userAPPInfo")!==null){
                    var allComedianData=JSON.parse(localStorage.getItem("userAPPInfo"));
                    if(typeof(allComedianData)=="object"){
                        var simpleComedian=allComedianData[appID];
                        if(typeof(simpleComedian["userAPPID"])!=="undefined"){
                            var userAPPID=simpleComedian["userAPPID"];
                            if(userAPPID===userAPPIDCurrent){
                                postData["userappid"]=userAPPID;
                                sendAjaxOnFly(postData, null, $this);
                            }
                        }
                    }
                }
            }
        break;
    }
});

$$("form[data-action='handlewithform']").setCustomValidityFormTranslations();

$$(document).on("submit", "form[data-action='handlewithform']", function(e){
    e.preventDefault();
    $$(this).checkFields();
    return false;
});

$$(document).on("change", "select[data-action='addedititem']", function(e){
    e.preventDefault();
    var $this=$$(this);
    
    var postData={id: $this.attr("data-id"), context: $this.attr("data-context")};
    
    switch(postData["context"]){
        case "wrapProvinceSBForCountry":
            var form=$this.closest("form");
            var obj;
            if(form.find("select[name='aEOE_appuserprovince']").length>0){
                obj=form.find("select[name='aEOE_appuserprovince']");
            }
            if(form.find("select[name='aEOE_province']").length>0){
                obj=form.find("select[name='aEOE_province']");
            }
            postData["id"]=parseInt($this.val());
            if(postData["id"]>0){
                sendAjaxOnFly(postData, form, obj);
            }
        break;
    }
});


function readTextFile(file, actionAfter){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                switch(actionAfter){
                    default:
                        return allText;
                    break;
                    case "getJSON":
                        var obj=JSON.parse(allText);
                        if(obj){
                            GOOGLE_MAPS_STATIC_V3_API_KEY=obj["gapikey"];
                            $$("input[name='appID']").val(obj["appid"]);
                        }
                    break;
                    case "compileTemplate":
                        var name = getFileNameFromFullPath(file);
                        window[name]=allText;
                        compiledWelcomeTemplate = Template7.compile(welcomeTemplate);
                    break;
                    case "compileNavbarTemplate":
                        var name = getFileNameFromFullPath(file);
                        window[name]=allText;
                        compiledNavbarTemplate = Template7.compile(navbarTemplate);
                    break;
                    case "compileNavbarTemplateDetails":
                        var name = getFileNameFromFullPath(file);
                        window[name]=allText;
                        compiledNavbarTemplateDetails = Template7.compile(navbarTemplateDetails);
                    break;
                }
            }
        }
    }
    rawFile.send(null);
}

function loadComedian(){
    var appID=$$("input[name='appID']").val();
    if(appID!==null && appID!==""){
        //load Ajax based comedian info
        var postData={context: "loadInitComedian", appid: appID};
        
        if(localStorage.getItem("userAPPInfo")!==null){
            var obj={};
            var allComedianData=JSON.parse(localStorage.getItem("userAPPInfo"));
            if(typeof(allComedianData)=="object"){
                if(typeof(allComedianData[appID])!=="undefined"){
                    var simpleComedian=allComedianData[appID];
                    //Check is this user already registered to this comedian Application
                    if(typeof(simpleComedian["userAPPID"])!=="undefined"){
                        
                        var userAPPID=simpleComedian["userAPPID"];
                        if(parseInt(userAPPID)>0){
                            $$("input[name='userAPPID']").val(userAPPID);
                            postData['ignorecountries']=true;
                            
                            Framework7.request.post(
                            pathToAjaxDispatcher, 
                            postData, 
                            function(data){
                                isAjaxLoaded=false;
                                if(data["success"]==1){
                                    simpleComedian["comedian"]=data["results"];
                                    var allComedians=JSON.parse(localStorage.getItem("userAPPInfo"));
                                    if(typeof(allComedians)==="object"){
                                        
                                       allComedians[postData["appid"]]=simpleComedian;
                                       localStorage.setItem("userAPPInfo", totalStringify(allComedians));
                                       allComedians=JSON.parse(localStorage.getItem("userAPPInfo"));
                                       if(typeof(allComedians)==="object"){
                                            if(typeof(allComedians[postData["appid"]])!=="undefined"){
                                                simpleComedian=allComedians[postData["appid"]];
                                                if(typeof(simpleComedian)==="object"){
                                                    simpleComedian["userAPPID"]=userAPPID;
                                                    
                                                    allComedians[postData["appid"]]=simpleComedian;
                                                    localStorage.setItem("userAPPInfo", totalStringify(allComedians));
                                                    
                                                    
                                                    obj.comedian=simpleComedian.comedian;
                                                    var html=compiledWelcomeTemplate(obj);
                                                    $$('#replaceWithWelcomeContent').html(html);
                                                    var navbar=compiledNavbarTemplate(obj.comedian);
                                                    var navbarDetails=compiledNavbarTemplateDetails();
                                                    $$("div[data-target='dynamic-navbar']").html(navbar);
                                                    $$("div[data-target='dynamic-navbar-details']").html(navbarDetails);
                                                    window.setTimeout(function(){
                                                        $$("form[data-action='handlewithform']").setCustomValidityFormTranslations();
                                                        $$("a[href='#tab-dashboard']").click();
                                                        $$("div[data-target='welcomeTemplate']").removeClass("hidden");

                                                        var calendarDefault = app.calendar.create({
                          inputEl: '#calendar-default'
                        });


                                                    }, 10);

                                                    return false;
                                                }
                            
                                            }
                                        }
                                    }
                                }else{
                                    dynamicPopup.emit('open-custom', data["message"]);
                                }
                            }, function(xhr, status){
                                isAjaxLoaded=false;
                                console.log(status);
                            },
                            "json");
                           
                            return false;
                        }
                    }
                }
            }
            
        }
        
        
        Framework7.request.post(
            pathToAjaxDispatcher, 
            postData, 
            function(data){
                isAjaxLoaded=false;
                if(data["success"]==1){
                    
                    data["results"]=extend(currentLocation, data["results"]);
                    
                    var obj={};
                    var tempObject={};
                    var simpleComedian={};
                    simpleComedian["comedian"]=data["results"];
                    tempObject[postData["appid"]]=simpleComedian;
                    
                    localStorage.setItem("countriesObject", totalStringify(data["countries"]));
                    
                    if(localStorage.getItem("userAPPInfo")===null){
                        localStorage.setItem("userAPPInfo", totalStringify(tempObject));
                    }else{
                        var allComedians=JSON.parse(localStorage.getItem("userAPPInfo"));
                        if(typeof(allComedians)==="object"){
                           allComedians[postData["appid"]]=simpleComedian;
                           localStorage.setItem("userAPPInfo", totalStringify(allComedians));
                        }
                    }
                    tempObject={};
                    simpleComedian={};
                    allComedians={};
                    
                    allComedians=JSON.parse(localStorage.getItem("userAPPInfo"));
                    var countries=JSON.parse(localStorage.getItem("countriesObject"));
                    
                    if(typeof(allComedians)==="object"){
                        if(typeof(allComedians[postData["appid"]])!=="undefined"){
                            simpleComedian=allComedians[postData["appid"]];
                            
                            obj.comedian=simpleComedian.comedian;
                            obj.countriesObject=countries;
                            obj.welcomeScreen=1;
                            var html=compiledWelcomeTemplate(obj);
                            $$('#replaceWithWelcomeContent').html(html);
                            var navbar=compiledNavbarTemplate(obj.comedian);
                            var navbarDetails=compiledNavbarTemplateDetails();
                            $$("div[data-target='dynamic-navbar']").html(navbar);
                            $$("div[data-target='dynamic-navbar-details']").html(navbarDetails);
                            window.setTimeout(function(){
                                $$("a[href='#tab-1']").click();
                                $$("div[data-target='welcomeTemplate']").removeClass("hidden");
                                
                                $$("form[data-action='handlewithform']").setCustomValidityFormTranslations();
                                
                                var calendarDefault = app.calendar.create({
  inputEl: '#calendar-default'
});
                            }, 10);
                        }else{
                            dynamicPopup.emit('open-custom', "Comedian is not initialized properly.");
                        }
                    }else{
                        dynamicPopup.emit('open-custom', "Comedian object is not well formed.");
                    }
                    
                    
                }else{
                    dynamicPopup.emit('open-custom', data["message"]);
                }
            }, function(xhr, status){
                isAjaxLoaded=false;
                console.log(status);
            },
            "json"
            );
    }
}

function loadComedianData(self, context){
    var appID=$$("input[name='appID']").val();
    var userAPPID=$$("input[name='userAPPID']").val();
    
    if(appID!==null && appID!==""){
        //load Ajax based comedian info
        var postData={context: context, appid: appID, userappid: userAPPID};
        if(arguments[2]){
            postData["count"]=arguments[2];
        }
        if($$("[data-target='load-more-btn']").length>0){
           $$("[data-target='load-more-btn']").removeClass("activated fadeIn");
        }
        app.request.post(
            pathToAjaxDispatcher, 
            postData, 
            function(data){
                isAjaxLoaded=false;
                if(data["success"]==1){
                    var obj={};
                    self.$setState(data["results"]);
                    switch(context){
                        case "loadComedianEvents":
                        case "loadComedianVideos":
                        case "loadComedianNews":
                        case "loadComedianSocial":
                        case "loadComedianPodcast":
                        case "loadComedianGalleries":    
                            $$("div.wrapWelcomeComedianIntro").activatedOneByOne(".singleItem", "fadeInUp");
                            switch(context){
                                case "loadComedianPodcast":
                                    $$("div.wrapPlayer").wrapAudioPlayers();
                                    window.setTimeout(function(){
                                        $$("[data-target='load-more-btn']").addClass(data["results"]["classActivated"]);
                                    }, 1000);
                                break;
                                case "loadComedianGalleries":
                                    window.setTimeout(function(){
                                        $$("[data-target='load-more-btn']").addClass(data["results"]["classActivated"]);
                                    }, 1000);
                                break;
                            }
                        break;
                    }
                }else{
                    dynamicPopup.emit('open-custom', data["message"]);
                }
            }, function(xhr, status){
                isAjaxLoaded=false;
                console.log(status);
            },
            "json"
            );
    }
}

function loadEventGoogleImg(self, id){
    //load Ajax based comedian info
    var postData={context: "loadEventGoogleImg", id: id};
    app.request.post(
        pathToAjaxDispatcher, 
        postData, 
        function(data){
            isAjaxLoaded=false;
            if(data["success"]==1){
                var obj={};
                obj["googleimg"]=data["content"];
                obj["googlemapurl"]=data["googlemapurl"];
                self.$setState(obj);
            }else{
                //dynamicPopup.emit('open-custom', data["message"]);
            }
        }, function(xhr, status){
            isAjaxLoaded=false;
            console.log(status);
        },
        "json"
        );
}

function loadEventPerformingComedians(self, id){
    //load Ajax based comedian info
    var postData={context: "loadEventPerformingComedians", id: id};
    app.request.post(
        pathToAjaxDispatcher, 
        postData, 
        function(data){
            isAjaxLoaded=false;
            if(data["success"]==1){
                var obj={};
                obj["performing"]=data["results"];
                obj["performingnot"]=data["resultsnot"];
                self.$setState(obj);
            }else{
                //dynamicPopup.emit('open-custom', data["message"]);
            }
        }, function(xhr, status){
            isAjaxLoaded=false;
            console.log(status);
        },
        "json"
        );
}


// Create dynamic Popup
var dynamicPopup = app.popup.create({
  content: '<div class="popup">'+
              '<div class="block">'+
                '<div id="popupContent">Popup created dynamically.</div>'+
                '<p><a href="#" class="link popup-close">Close me</a></p>'+
              '</div>'+
            '</div>',
  // Events
  on: {
    'open-custom': function (payload) {
        this.$el.find("#popupContent").html(payload);
        this.open();
    }
  }
});

function sendAjaxOnFly(postData, form, obj){
    app.request.post(
        pathToAjaxDispatcher, 
        postData, 
        function(data){
            isAjaxLoaded=false;
            if(data["success"]==1){
                if(data["silent"]){
                    return false;
                }
                switch(postData["context"]){
                    case "wrapProvinceSBForCountry":
                        var content=displayAllRecords(data["results"], data["content"]);
                        obj.empty().html(content);
                        obj.focus();
                    break;
                    case "rsvpEvent":
                        var currentRow=obj.closest(".singleItem");
                        currentRow.addClass("wrap-rsvped");
                        app.swipeout.close(currentRow);
                    break;
                }
            }else{
                if(data["silent"]){
                    return false;
                }
                dynamicPopup.emit('open-custom', data["message"]);
            }
        }, function(xhr, status){
            isAjaxLoaded=false;
            console.log(status);
        },
        "json"
        );
}

function getCurrentLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude=position.coords.latitude;
            var longitude=position.coords.longitude;
            getAddress(latitude, longitude);
        });
    }else{
        dynamicPopup.emit('open-custom', "Geolocation is not supported.");
    }
}

function getAddress (latitude, longitude) {
  Framework7.request.promise.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + GOOGLE_MAPS_STATIC_V3_API_KEY)
  .then(
    function success (response) {
      currentLocation=getLocationParameters(JSON.parse(response));
      loadComedian();
    },
    function fail (status) {
      console.log('Request failed.  Returned status of',
                  status)
    }
   )
}

function getLocationParameters(obj){
    var a={};
    if(obj.status=="OK" && obj.results){
        for (var ac = 0; ac < obj.results[0].address_components.length; ac++) {
            var component = obj.results[0].address_components[ac];

            switch(component.types[0]) {
                case 'locality':
                    a.userappcity = component.long_name;
                    break;
                case 'administrative_area_level_1':
                    a.userappprovincename = component.short_name;
                    break;
                case 'country':
                    a.userappcountryname = component.long_name;
                    a.userappcountryname_iso_code = component.short_name;
                    break;
            }
        }
    }
    return a;
}

function displayAllRecords(data, template){
    var content="";
    if(data){
        Object.keys(data).forEach(function(i) {
            var obj=data[i];
        //$$.each(data, function(i, obj){
            content +=wrapSingleRecordWithData(obj, template);
        });
    }else{
        content +=template;
    }
    return content;
}

function wrapSingleRecordWithData(data, template){
    var regex=/{{((\w+|\-))}}/g;
    var content="";
    var newTemplate=template.replace(regex, function(a, b){
        var tempContent="";
        if(b=="wrapsublisthere" && typeof(data["results"])!="undefined" && !$.isEmptyObject(data["results"]) && typeof(data["content"])!="undefined" && !$.isEmptyObject(data["content"])){
            tempContent +=displayAllRecords(data["results"], data["content"]);
        }
        
        tempContent +=typeof(data[b])!=="undefined"?data[b]:"";
        return tempContent;
        
    });
    content +=newTemplate;
    return content;
}

function getFileNameFromFullPath(fullPath){
    var filename = fullPath.replace(/^.*[\\\/]/, '');
    var name = filename.substr(0, filename.lastIndexOf('.'));
    return name;
}

function activateDynamicDetailsNavBar(){
    var iconString=arguments[0]?arguments[0]:null;
    var title=arguments[1]?arguments[1]:null;
    if(iconString!==null){
        $$("div[data-target='dynamic-navbar-details'] [data-target='faicon']").attr("src", "./images/app_" + iconString + "_small.png");
        
    }
    if(title!==null){
        $$("div[data-target='dynamic-navbar-details'] [data-target='title']").text(title);
    }
    $$("div[data-target='dynamic-navbar-details']").addClass("activated");
}

function activateDynamicNavBar(){
    var iconString=arguments[0]?arguments[0]:null;
    if(iconString!==null){
        $$("div[data-target='dynamic-navbar'] [data-target='faicon']").attr("src", "./images/app_" + iconString + "_small.png");
    }
    $$("div[data-target='dynamic-navbar']").addClass("activated");
}

function removeDynamicNavBar(){
    $$("div[data-target='dynamic-navbar']").removeClass("activated");
    window.setTimeout(function(){
        $$("div[data-target='dynamic-navbar'] [data-target='faicon']").removeAttr("src");
    }, 500);
    
}

function removeDynamicDetailsNavBar(){
    $$("div[data-target='dynamic-navbar-details']").removeClass("activated");
    window.setTimeout(function(){
        $$("div[data-target='dynamic-navbar-details'] [data-target='faicon']").removeAttr("src");
    }, 500);
    
}

function checkForFirstTime(etype){
    //Force it to null, for testing only
    //localStorage.removeItem("userAPPFirstTime");
    
    var showFNotification=false;
    var divParent=$$("#wrapFirstTimeNotifications");
    divParent.removeClass("activated").find("div[data-target='first-time']").removeClass("activated");
    if(localStorage.getItem("userAPPFirstTime")!==null){
        var allClicked=JSON.parse(localStorage.getItem("userAPPFirstTime"));
        if(typeof(allClicked)==="object"){
            if(typeof(allClicked[etype])==="undefined"){
                showFNotification=true;
            }
        }else{
            showFNotification=true;
        }
    }else{
        showFNotification=true;
    }
    if(showFNotification){
        divParent.addClass("activated").find("div[data-target='first-time'][data-etype='" + etype + "']").addClass("activated");
    }
}

function hideFirstTimeNotification(){
    var divParent=$$("#wrapFirstTimeNotifications");
    divParent.animate(
        {
            opacity: 0
        },
        {
            duration: 300,
            complete: function (elements) {
                elements.removeClass("activated").css("opacity", 1).find("div[data-target='first-time']").removeClass("activated");
            }
        }
    );
}

function extend(obj, src) {
    Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
    return obj;
}

function totalStringify(data){
    var str=JSON.stringify(data);
    str = str.escapeSpecialChars();
    return str;
}

 String.prototype.escapeSpecialChars = function() {
    return this.replace(/\\n/g, "\\n")
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");
};

function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

// Returns if a value is an object
function isObject (value) {
    return value && typeof value === 'object' && value.constructor === Object;
}

function stopAllActivePlayers(i){
    $$("div.wrapPlayer").each(function(){
        var $this=$$(this);
        var currentIndex=$this.closest(".singleItem").index();
        var controls=$this.find("div.wrap-custom-player-controls");
        var btn=controls.find("div.buttons");
        var player=$this.find("audio")[0];
        if(player.readyState!=0){
            player.pause();
            if(currentIndex!=i){
                player.currentTime=0;
            }
            btn.removeClass('paused');
        }
    });
}

function initProgressBar(obj) {
    var player = obj;
    var length = player.duration
    var current_time = player.currentTime;

    // calculate total length of value
    var totalLength = calculateTotalValue(length);

    // calculate current value time
    var currentTime = calculateCurrentValue(current_time);
    
    var currentProgress=((player.currentTime / player.duration) * 100);
    
    
    

    var progressBar = $$(obj).closest("div.wrapPlayer").find("div.wrap-custom-player-progress-bar")[0];
    var progressBarHolder=$$(progressBar).closest("div.wrap-custom-player-loader-bg")[0];
    var btn=$$(obj).closest("div.wrapPlayer").find("div.buttons");
    if(player.currentTime>2){
        btn.removeClass("preloader-in-act");
    }
    $$(progressBar).css({
        width: currentProgress + "%"
    });
    
    progressBarHolder.addEventListener("click", seek);

    if (player.currentTime == player.duration) {
        btn.removeClass('paused');
        $$(progressBar).css({
            width: 0
        });
    }

    function seek(evt) {
        var percent = evt.offsetX / this.offsetWidth;
        player.currentTime = percent * player.duration;
        $$(progressBar).css({
            width: (percent * 100) + "%"
        });
    }
};

function calculateTotalValue(length) {
  var minutes = Math.floor(length / 60),
    seconds_int = length - minutes * 60,
    seconds_str = seconds_int.toString(),
    seconds = seconds_str.substr(0, 2),
    time = minutes + ':' + seconds

  return time;
}

function calculateCurrentValue(currentTime) {
  var current_hour = parseInt(currentTime / 3600) % 24,
    current_minute = parseInt(currentTime / 60) % 60,
    current_seconds_long = currentTime % 60,
    current_seconds = current_seconds_long.toFixed(),
    current_time = (current_minute < 10 ? "0" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);

  return current_time;
}