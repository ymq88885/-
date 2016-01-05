(function($){
    $.fn.passwordStrength=function(settings){
        settings=$.extend({},$.fn.passwordStrength.defaults,settings);
        this.each(function(){
            var $this = $(this),
                scores = 0,
                checkingerror = false,
                id =$this.attr("id") ;
            var createPasswordStrength = function(id){
                var psdstrengthStr = [
                    "<div id=\"" + id + "_pwd_ck\" class=\"passwordStrength\">",
                        "<div id=\""+id+"pwd_status\" class=\"strength-wrap\">" ,
                            "<em id=\"" + id + "_weak\" class=\"l1\"></em>" ,
                            "<em id=\"" + id + "_normal\" class=\"l2\"></em>" ,
                            "<em id=\"" + id + "_strong\" class=\"l3\"></em>" ,
                        "</div>" ,
                    "</div>"
                ].join("");
                $this.parent().after(psdstrengthStr);
            }
            var removePasswordStrength = function(id){
                if($("#"+id+"_pwd_ck").length>0){
                    $("#"+id+"_pwd_ck").remove();
                }
            }
            var showPasswordStrength = function(id,psd){
                if ($("#" + id).val() == "")
                    return;
                var S_level = $.fn.passwordStrength.checkStrong(psd);
                var txtMode = settings.txtMode;  //提示文字是在前面还是在中间
 
                var getLevelTypeOrText = function(level,flag){
                    var tempObj ={
                        levelType: ["weak","normal","strong"],
                        levelText:["弱","中","强"]
                    }
                    var tempStr = "";
                    if(level <= 1){
                        tempStr = tempObj[flag][0];
                    }else if(level == 2){
                        tempStr = tempObj[flag][1];
                    }else{
                        tempStr = tempObj[flag][2];
                    }
                    return tempStr;
                }
 
                var tipText = getLevelTypeOrText(S_level,"levelText");
                var classType = getLevelTypeOrText(S_level,"levelType");
                if(!!txtMode){
                    var tipSpan = "<span class='strength-title'>密码强度:</span><span class='"+classType+"'>"+tipText+"</span>";
                    $("#" + id + "_weak").before(tipSpan);
                }
                var newClass = "strength-wrap strength-"+classType;
                $("#"+id+"pwd_status").removeClass().addClass(newClass);
                txtMode && (tipText = "");
                $("#" + id + "_"+classType).html(tipText);
                return;
            }
            var passwordStrengthCheck = function(id,pwd){
                removePasswordStrength(id);
                if(pwd !=""){
                    createPasswordStrength(id);
                    showPasswordStrength(id,pwd);
                }
            }
            $this.bind("keyup focus",function(){
                var psd = $this.val();
                passwordStrengthCheck(id,psd)
 
            });
            $this.bind("blur",function(){
                removePasswordStrength(id);
            });
        });
    }
     
    $.fn.passwordStrength.ratepasswd=function(passwd,config){
        //判断密码强度
        var len = passwd.length, scores;
        if(len >= config.minLen && len <= config.maxLen){
            scores = $.fn.passwordStrength.checkStrong(passwd);
        }else{
            scores = -1;
        }
        return scores/4*100;    //[0,35)弱，[35，60）中，[60，+）强
             
    }
     
    //密码强度;
    $.fn.passwordStrength.checkStrong=function(sPW){
        var modes = 0, len = sPW.length;
        if (len < 8)
            return 0; //密码太短
        for(var i = 0;i < len; i++){
            //密码模式
            modes |= $.fn.passwordStrength.charMode(sPW.charCodeAt(i));
            //只有两个操作数上相对应的位都是0时，其运算结果相对应的位才是0，否则为1。
        }
        return $.fn.passwordStrength.bitTotal(modes);   //返回 0，1->弱 2->中 3->强
    }
     
    //字符类型;
    $.fn.passwordStrength.charMode=function(iN){
        if(iN >= 48 && iN <= 57){ // 0-9
            return 1;
        }else if(iN >= 65 && iN <= 90){ // A-Z
            return 2;
        }else if(iN >= 97 && iN <= 122){ // a-z
            return 4;
        }else{ // 其它
            return 8;
        }
    }
     
    //计算出当前密码当中一共有多少种模式;
    $.fn.passwordStrength.bitTotal=function(num){//传入参数1 2 4 8
        var modes = 0;
        for(var i = 0;i < 4;i++){
            if(num & 1){modes++;}
            num >>>= 1;
        }
        return modes;
    }
     
    $.fn.passwordStrength.defaults={
        minLen:0,
        maxLen:30,
        txtMode:0,
        trigger:$.noop,
        showmsg:$.noop
    }
})(jQuery);
