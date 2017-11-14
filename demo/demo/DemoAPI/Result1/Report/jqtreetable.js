/* 
Copyright: Paul Hanlon

Released under the MIT/BSD licence which means you can do anything you want 
with it, as long as you keep this copyright notice on the page 
*/
(function(jq){
  jq.fn.jqTreeTable=function(map, options){
    var opts = jq.extend({openImg:"",shutImg:"",leafImg:"",lastOpenImg:"",lastShutImg:"",lastLeafImg:"",vertLineImg:"",blankImg:"",collapse:false,column:0,striped:false,highlight:false,state:true},options),
    mapa=[],mapb=[],tid=this.attr("id"),collarr=[],
	  stripe=function(){
      if(opts.striped){
  		  $("#"+tid+" tr:visible").filter(":even").addClass("even").end().filter(":odd").removeClass("even");
      }
	  },
    buildText = function(parno, preStr){//Recursively build up the text for the images that make it work
      var mp=mapa[parno], ro=0, pre="", pref, img;
      for (var y=0,yl=mp.length;y<yl;y++){
        ro = mp[y];
        if (mapa[ro]){//It's a parent as well. Build it's string and move on to it's children
          pre=(y==yl-1)? opts.blankImg: opts.vertLineImg;
          img=(y==yl-1)? opts.lastOpenImg: opts.openImg;
          mapb[ro-1] = preStr + '<img src="'+img+'" class="parimg" id="'+tid+ro+'">';
          pref = preStr + '<img src="'+pre+'" class="preimg">';
          arguments.callee(ro, pref);
        }else{//it's a child
          img = (y==yl-1)? opts.lastLeafImg: opts.leafImg;//It's the last child, It's child will have a blank field behind it
          mapb[ro-1] = preStr + '<img src="'+img+'" class="ttimage" id="'+tid+ro+'">';
        }
      }
    },
    expandKids = function(num, last){//Expands immediate children, and their uncollapsed children
      jq("#"+tid+num).attr("src", (last)? opts.lastOpenImg: opts.openImg);//
      for (var x=0, xl=mapa[num].length;x<xl;x++){
        var mnx = mapa[num][x];
        jq("#"+tid+mnx).parents("tr").removeClass("collapsed");
  			if (mapa[mnx] && opts.state && jq.inArray(mnx, collarr)<0){////If it is a parent and its number is not in the collapsed array
          arguments.callee(mnx,(x==xl-1));//Expand it. More intuitive way of displaying the tree
        }
      }
    },
    collapseKids = function(num, last){//Recursively collapses all children and their children and change icon
      jq("#"+tid+num).attr("src", (last)? opts.lastShutImg: opts.shutImg);
      for (var x=0, xl=mapa[num].length;x<xl;x++){
        var mnx = mapa[num][x];
        jq("#"+tid+mnx).parents("tr").addClass("collapsed");
        if (mapa[mnx]){//If it is a parent
          arguments.callee(mnx,(x==xl-1));
        }
      }
    },
  	creset = function(num, exp){//Resets the collapse array
  		var o = (exp)? collarr.splice(jq.inArray(num, collarr), 1): collarr.push(num);
      cset(tid,collarr);
  	},
  	cget = function(n){
	  	var v='',c=' '+document.cookie+';',s=c.indexOf(' '+n+'=');
	    if (s>=0) {
	    	s+=n.length+2;
	      v=(c.substring(s,c.indexOf(';',s))).split("|");
	    }
	    return v||0;
  	},
    cset = function (n,v) {
  		jq.unique(v);
	  	document.cookie = n+"="+v.join("|")+";";
	  };
    for (var x=0,xl=map.length; x<xl;x++){//From map of parents, get map of kids
      num = map[x];
      if (!mapa[num]){
        mapa[num]=[];
      }
      mapa[num].push(x+1);
    }
    buildText(0,"");
    jq("tr", this).each(function(i){//Inject the images into the column to make it work
      jq(this).children("td").eq(opts.column).prepend(mapb[i]);
      
    });
		collarr = cget(tid)||opts.collapse||collarr;
		if (collarr.length){
			cset(tid,collarr);
	    for (var y=0,yl=collarr.length;y<yl;y++){
	      collapseKids(collarr[y],($("#"+collarr[y]+ " .parimg").attr("src")==opts.lastOpenImg));
	    }
		}
    stripe();
    jq(".parimg", this).each(function(i){
      var jqt = jq(this),last;
      jqt.click(function(){
        var num = parseInt(jqt.attr("id").substr(tid.length));//Number of the row
        if (jqt.parents("tr").next().is(".collapsed")){//If the table row directly below is collapsed
          expandKids(num, (jqt.attr("src")==opts.lastShutImg));//Then expand all children not in collarr
					if(opts.state){creset(num,true);}//If state is set, store in cookie
        }else{//Collapse all and set image to opts.shutImg or opts.lastShutImg on parents
          collapseKids(num, (jqt.attr("src")==opts.lastOpenImg));
					if(opts.state){creset(num,false);}//If state is set, store in cookie
        }
        stripe();//Restripe the rows
      });
    });
    if (opts.highlight){//This is where it highlights the rows
      jq("tr", this).hover(
        function(){jq(this).addClass("over");},
        function(){jq(this).removeClass("over");}
      );
    };
  };
  return this;
})(jQuery);

// SIG // Begin signature block
// SIG // MIIelwYJKoZIhvcNAQcCoIIeiDCCHoQCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFPsU5L/0Lg3B
// SIG // kvOYU5gR9bqcVjpDoIIZkTCCA+4wggNXoAMCAQICEH6T
// SIG // 6/t8xk5Z6kuad9QG/DswDQYJKoZIhvcNAQEFBQAwgYsx
// SIG // CzAJBgNVBAYTAlpBMRUwEwYDVQQIEwxXZXN0ZXJuIENh
// SIG // cGUxFDASBgNVBAcTC0R1cmJhbnZpbGxlMQ8wDQYDVQQK
// SIG // EwZUaGF3dGUxHTAbBgNVBAsTFFRoYXd0ZSBDZXJ0aWZp
// SIG // Y2F0aW9uMR8wHQYDVQQDExZUaGF3dGUgVGltZXN0YW1w
// SIG // aW5nIENBMB4XDTEyMTIyMTAwMDAwMFoXDTIwMTIzMDIz
// SIG // NTk1OVowXjELMAkGA1UEBhMCVVMxHTAbBgNVBAoTFFN5
// SIG // bWFudGVjIENvcnBvcmF0aW9uMTAwLgYDVQQDEydTeW1h
// SIG // bnRlYyBUaW1lIFN0YW1waW5nIFNlcnZpY2VzIENBIC0g
// SIG // RzIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB
// SIG // AQCxrLNJVEuXHBIK2CV5kSJXKm/cuCbEQ3Nrwr8uUFr7
// SIG // FMJ2jkMBJUO0oeJF9Oi3e8N0zCLXtJQAAvdN7b+0t0Qk
// SIG // a81fRTvRRM5DEnMXgotptCvLmR6schsmTXEfsTHd+1Fh
// SIG // AlOmqvVJLAV4RaUvic7nmef+jOJXPz3GktxK+Hsz5HkK
// SIG // +/B1iEGc/8UDUZmq12yfk2mHZSmDhcJgFMTIyTsU2sCB
// SIG // 8B8NdN6SIqvK9/t0fCfm90obf6fDni2uiuqm5qonFn1h
// SIG // 95hxEbziUKFL5V365Q6nLJ+qZSDT2JboyHylTkhE/xni
// SIG // RAeSC9dohIBdanhkRc1gRn5UwRN8xXnxycFxAgMBAAGj
// SIG // gfowgfcwHQYDVR0OBBYEFF+a9W5czMx0mtTdfe8/2+xM
// SIG // gC7dMDIGCCsGAQUFBwEBBCYwJDAiBggrBgEFBQcwAYYW
// SIG // aHR0cDovL29jc3AudGhhd3RlLmNvbTASBgNVHRMBAf8E
// SIG // CDAGAQH/AgEAMD8GA1UdHwQ4MDYwNKAyoDCGLmh0dHA6
// SIG // Ly9jcmwudGhhd3RlLmNvbS9UaGF3dGVUaW1lc3RhbXBp
// SIG // bmdDQS5jcmwwEwYDVR0lBAwwCgYIKwYBBQUHAwgwDgYD
// SIG // VR0PAQH/BAQDAgEGMCgGA1UdEQQhMB+kHTAbMRkwFwYD
// SIG // VQQDExBUaW1lU3RhbXAtMjA0OC0xMA0GCSqGSIb3DQEB
// SIG // BQUAA4GBAAMJm495739ZMKrvaLX64wkdu0+CBl03X6ZS
// SIG // nxaN6hySCURu9W3rWHww6PlpjSNzCxJvR6muORH4KrGb
// SIG // sBrDjutZlgCtzgxNstAxpghcKnr84nodV0yoZRjpeUBi
// SIG // JZZux8c3aoMhCI5B6t3ZVz8dd0mHKhYGXqY4aiISo1EZ
// SIG // g362MIIEozCCA4ugAwIBAgIQDs/0OMj+vzVuBNhqmBsa
// SIG // UDANBgkqhkiG9w0BAQUFADBeMQswCQYDVQQGEwJVUzEd
// SIG // MBsGA1UEChMUU3ltYW50ZWMgQ29ycG9yYXRpb24xMDAu
// SIG // BgNVBAMTJ1N5bWFudGVjIFRpbWUgU3RhbXBpbmcgU2Vy
// SIG // dmljZXMgQ0EgLSBHMjAeFw0xMjEwMTgwMDAwMDBaFw0y
// SIG // MDEyMjkyMzU5NTlaMGIxCzAJBgNVBAYTAlVTMR0wGwYD
// SIG // VQQKExRTeW1hbnRlYyBDb3Jwb3JhdGlvbjE0MDIGA1UE
// SIG // AxMrU3ltYW50ZWMgVGltZSBTdGFtcGluZyBTZXJ2aWNl
// SIG // cyBTaWduZXIgLSBHNDCCASIwDQYJKoZIhvcNAQEBBQAD
// SIG // ggEPADCCAQoCggEBAKJjCzlEuLsjp0RJuw7/ofBhClOT
// SIG // sJjbrSwPSsVu/4Y8U1UPFc4EPyv9qZaW2b5heQtbyUyG
// SIG // duXgQ0sile7CK0PBn9hotI5AT+6FOLkRxSPyZFjwFTJv
// SIG // TlehroikAtcqHs1L4d1j1ReJMluwXplaqJ0oUA4X7pbb
// SIG // YTtFUR3PElYLkkf8q672Zj1HrHBy55LnX80QucSDZJQZ
// SIG // vSWA4ejSIqXQugJ6oXeTW2XD7hd0vEGGKtwITIySjJEt
// SIG // nndEH2jWqHR32w5bMotWizO92WPISZ06xcXqMwvS8aMb
// SIG // 9Iu+2bNXizveBKd6IrIkri7HcMW+ToMmCPsLvalPmQjh
// SIG // EChyqs0CAwEAAaOCAVcwggFTMAwGA1UdEwEB/wQCMAAw
// SIG // FgYDVR0lAQH/BAwwCgYIKwYBBQUHAwgwDgYDVR0PAQH/
// SIG // BAQDAgeAMHMGCCsGAQUFBwEBBGcwZTAqBggrBgEFBQcw
// SIG // AYYeaHR0cDovL3RzLW9jc3Aud3Muc3ltYW50ZWMuY29t
// SIG // MDcGCCsGAQUFBzAChitodHRwOi8vdHMtYWlhLndzLnN5
// SIG // bWFudGVjLmNvbS90c3MtY2EtZzIuY2VyMDwGA1UdHwQ1
// SIG // MDMwMaAvoC2GK2h0dHA6Ly90cy1jcmwud3Muc3ltYW50
// SIG // ZWMuY29tL3Rzcy1jYS1nMi5jcmwwKAYDVR0RBCEwH6Qd
// SIG // MBsxGTAXBgNVBAMTEFRpbWVTdGFtcC0yMDQ4LTIwHQYD
// SIG // VR0OBBYEFEbGaaMOShQe1UzaUmMXP142vA3mMB8GA1Ud
// SIG // IwQYMBaAFF+a9W5czMx0mtTdfe8/2+xMgC7dMA0GCSqG
// SIG // SIb3DQEBBQUAA4IBAQB4O7SRKgBM8I9iMDd4o4QnB28Y
// SIG // st4l3KDUlAOqhk4ln5pAAxzdzuN5yyFoBtq2MrRtv/Qs
// SIG // JmMz5ElkbQ3mw2cO9wWkNWx8iRbG6bLfsundIMZxD82V
// SIG // dNy2XN69Nx9DeOZ4tc0oBCCjqvFLxIgpkQ6A0RH83Vx2
// SIG // bk9eDkVGQW4NsOo4mrE62glxEPwcebSAe6xp9P2ctgwW
// SIG // K/F/Wwk9m1viFsoTgW0ALjgNqCmPLOGy9FqpAa8VnCwv
// SIG // SRvbIrvD/niUUcOGsYKIXfA9tFGheTMrLnu53CAJE3Hr
// SIG // ahlbz+ilMFcsiUk/uc9/yb8+ImhjU5q9aXSsxR08f5Lg
// SIG // w7wc2AR1MIIFSDCCBDCgAwIBAgIQVqMOmm6rRImITxDZ
// SIG // vvLfJDANBgkqhkiG9w0BAQUFADCBtDELMAkGA1UEBhMC
// SIG // VVMxFzAVBgNVBAoTDlZlcmlTaWduLCBJbmMuMR8wHQYD
// SIG // VQQLExZWZXJpU2lnbiBUcnVzdCBOZXR3b3JrMTswOQYD
// SIG // VQQLEzJUZXJtcyBvZiB1c2UgYXQgaHR0cHM6Ly93d3cu
// SIG // dmVyaXNpZ24uY29tL3JwYSAoYykxMDEuMCwGA1UEAxMl
// SIG // VmVyaVNpZ24gQ2xhc3MgMyBDb2RlIFNpZ25pbmcgMjAx
// SIG // MCBDQTAeFw0xNDA2MjUwMDAwMDBaFw0xNjA3MjQyMzU5
// SIG // NTlaMHoxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxp
// SIG // Zm9ybmlhMRIwEAYDVQQHEwlQYWxvIEFsdG8xIDAeBgNV
// SIG // BAoUF0hld2xldHQtUGFja2FyZCBDb21wYW55MSAwHgYD
// SIG // VQQDFBdIZXdsZXR0LVBhY2thcmQgQ29tcGFueTCCASIw
// SIG // DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANiIDOKo
// SIG // YRfq+1bmVb70JKjFTGulO/xvHP8gCTVZlHJ788S0OXfE
// SIG // 08TZ/qitX98+CZ0c/5rh9O71BU7o7vaZwTjPaYjvm9Dp
// SIG // jaJJIzFyX9XzQuo4FfpVdgrwhPUVH8ERFPuJwztEs8mG
// SIG // l+7Y488fKzUPYqueGP/bs77qFCJAu+1K0omyr+V7Szyb
// SIG // 9TgaSaYauStcly07FuQO4V+1a6wund2SQJOe4hT2bjCH
// SIG // UrTre/y+AoavNAzn/gC3IvfcDkR5wUM69nWAW6gzcmwV
// SIG // rCvqO6T2fHM8tfazQ2sxWSgK5cgDuJgr4aIZCjNkIR/9
// SIG // zNikL0rnyQgpVpeNbnIXRHBlRzsCAwEAAaOCAY0wggGJ
// SIG // MAkGA1UdEwQCMAAwDgYDVR0PAQH/BAQDAgeAMCsGA1Ud
// SIG // HwQkMCIwIKAeoByGGmh0dHA6Ly9zZi5zeW1jYi5jb20v
// SIG // c2YuY3JsMGYGA1UdIARfMF0wWwYLYIZIAYb4RQEHFwMw
// SIG // TDAjBggrBgEFBQcCARYXaHR0cHM6Ly9kLnN5bWNiLmNv
// SIG // bS9jcHMwJQYIKwYBBQUHAgIwGRYXaHR0cHM6Ly9kLnN5
// SIG // bWNiLmNvbS9ycGEwEwYDVR0lBAwwCgYIKwYBBQUHAwMw
// SIG // VwYIKwYBBQUHAQEESzBJMB8GCCsGAQUFBzABhhNodHRw
// SIG // Oi8vc2Yuc3ltY2QuY29tMCYGCCsGAQUFBzAChhpodHRw
// SIG // Oi8vc2Yuc3ltY2IuY29tL3NmLmNydDAfBgNVHSMEGDAW
// SIG // gBTPmanqeyb0S8mOj9fwBSbv49KnnTAdBgNVHQ4EFgQU
// SIG // OkvxP+eByHNShSL981hZjRSCpD0wEQYJYIZIAYb4QgEB
// SIG // BAQDAgQQMBYGCisGAQQBgjcCARsECDAGAQEAAQH/MA0G
// SIG // CSqGSIb3DQEBBQUAA4IBAQAxLfQTvESWX0fgRBxEFEGL
// SIG // w6ga6YAj0/dKB1f52cZUTaRJZ1BNOrT8UpmaoXljVw32
// SIG // Hq2F0qyJkM/fhInZ7ljEDom8LK73Wmo/+ASDPZYgtxWH
// SIG // nEFOOcgXOuZDg4Numr1l6FiazVpauROez2nb1OOQXbYB
// SIG // eWo618IxCMiBYyXufwAH0nbvM18FF62Tzm4Fi9PZHY3z
// SIG // HjoR+bMxULW8C1QZQJfmzv6IgdhLJ62kboRCD+4K4tFs
// SIG // +Z11/tcL0QMftqnrw/AIJHtpzIblUXL2kX4AwWz7g45B
// SIG // Bi0flkLN1Ehy6rRmrBmB6hxUcOtpKqdjRPaX0E15Y5rT
// SIG // niY0dv4kbhi/MIIFmjCCA4KgAwIBAgIKYRmT5AAAAAAA
// SIG // HDANBgkqhkiG9w0BAQUFADB/MQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMSkwJwYDVQQDEyBNaWNyb3NvZnQgQ29kZSBWZXJp
// SIG // ZmljYXRpb24gUm9vdDAeFw0xMTAyMjIxOTI1MTdaFw0y
// SIG // MTAyMjIxOTM1MTdaMIHKMQswCQYDVQQGEwJVUzEXMBUG
// SIG // A1UEChMOVmVyaVNpZ24sIEluYy4xHzAdBgNVBAsTFlZl
// SIG // cmlTaWduIFRydXN0IE5ldHdvcmsxOjA4BgNVBAsTMShj
// SIG // KSAyMDA2IFZlcmlTaWduLCBJbmMuIC0gRm9yIGF1dGhv
// SIG // cml6ZWQgdXNlIG9ubHkxRTBDBgNVBAMTPFZlcmlTaWdu
// SIG // IENsYXNzIDMgUHVibGljIFByaW1hcnkgQ2VydGlmaWNh
// SIG // dGlvbiBBdXRob3JpdHkgLSBHNTCCASIwDQYJKoZIhvcN
// SIG // AQEBBQADggEPADCCAQoCggEBAK8kCAgpejWeYAyq50s7
// SIG // Ttx8vDxFHLsr4P4pAvlXCKNkhRUn9fGtyDGJXSLoKqqm
// SIG // QrOP+LlVt7G3S7P+j34HV+zvQ9tmYhVhz2ANpNje+ODD
// SIG // Ygg9VBPrScpZVIUm5SuPG5/r9aGRwjNJ2ENjalJL0o/o
// SIG // cFFN0Ylpe8dw9rPcEnTbe11LVtOWvxV3obD0oiXyrxyS
// SIG // Zxjl9AYE75C55ADk3Tq1Gf8CuvQ87uCL6zeL7PTXrPL2
// SIG // 8D2v3XWRMxkdHEDLdCQZIZPZFP6sKlLHj9UESeSNY0eI
// SIG // PGmDy/5HvSt+T8WVrg6d1NFDwGdz4xQIfuU/n3O4MwrP
// SIG // XT80h5aK7lPoJRUCAwEAAaOByzCByDARBgNVHSAECjAI
// SIG // MAYGBFUdIAAwDwYDVR0TAQH/BAUwAwEB/zALBgNVHQ8E
// SIG // BAMCAYYwHQYDVR0OBBYEFH/TZafC3ey78DAJ80M5+gKv
// SIG // MzEzMB8GA1UdIwQYMBaAFGL7CiFbf0NuEdoJVFBr9dKW
// SIG // cfGeMFUGA1UdHwROMEwwSqBIoEaGRGh0dHA6Ly9jcmwu
// SIG // bWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01p
// SIG // Y3Jvc29mdENvZGVWZXJpZlJvb3QuY3JsMA0GCSqGSIb3
// SIG // DQEBBQUAA4ICAQCBKoIWjDRnK+UD6zR7jKKjUIr0VYbx
// SIG // HoyOrn3uAxnOcpUYSK1iEf0g/T9HBgFa4uBvjBUsTjxq
// SIG // UGwLNqPPeg2cQrxc+BnVYONp5uIjQWeMaIN2K4+Toyq1
// SIG // f75Z+6nJsiaPyqLzghuYPpGVJ5eGYe5bXQdrzYao4mWA
// SIG // qOIV4rK+IwVqugzzR5NNrKSMB3k5wGESOgUNiaPsn1eJ
// SIG // hPvsynxHZhSR2LYPGV3muEqsvEfIcUOW5jIgpdx3hv08
// SIG // 44tx23ubA/y3HTJk6xZSoEOj+i6tWZJOfMfyM0JIOFE6
// SIG // fDjHGyQiKEAeGkYfF9sY9/AnNWy4Y9nNuWRdK6Ve78Yp
// SIG // tPLH+CHMBLpX/QG2q8Zn+efTmX/09SL6cvX9/zocQjqh
// SIG // +YAYpe6NHNRmnkUB/qru//sXjzD38c0pxZ3stdVJAD2F
// SIG // uMu7kzonaknAMK5myfcjKDJ2+aSDVshIzlqWqqDMDMR/
// SIG // tI6Xr23jVCfDn4bA1uRzCJcF29BUYl4DSMLVn3+nZozQ
// SIG // nbBP1NOYX0t6yX+yKVLQEoDHD1S2HmfNxqBsEQOE00h1
// SIG // 5yr+sDtuCjqma3aZBaPxd2hhMxRHBvxTf1K9khRcSiRq
// SIG // Z4yvjZCq0PZ5IRuTJnzDzh69iDiSrkXGGWpJULMF+K5Z
// SIG // N4pqJQOUsVmBUOi6g4C3IzX0drlnHVkYrSCNlDCCBgow
// SIG // ggTyoAMCAQICEFIA5aolVvwahu2WydRLM8cwDQYJKoZI
// SIG // hvcNAQEFBQAwgcoxCzAJBgNVBAYTAlVTMRcwFQYDVQQK
// SIG // Ew5WZXJpU2lnbiwgSW5jLjEfMB0GA1UECxMWVmVyaVNp
// SIG // Z24gVHJ1c3QgTmV0d29yazE6MDgGA1UECxMxKGMpIDIw
// SIG // MDYgVmVyaVNpZ24sIEluYy4gLSBGb3IgYXV0aG9yaXpl
// SIG // ZCB1c2Ugb25seTFFMEMGA1UEAxM8VmVyaVNpZ24gQ2xh
// SIG // c3MgMyBQdWJsaWMgUHJpbWFyeSBDZXJ0aWZpY2F0aW9u
// SIG // IEF1dGhvcml0eSAtIEc1MB4XDTEwMDIwODAwMDAwMFoX
// SIG // DTIwMDIwNzIzNTk1OVowgbQxCzAJBgNVBAYTAlVTMRcw
// SIG // FQYDVQQKEw5WZXJpU2lnbiwgSW5jLjEfMB0GA1UECxMW
// SIG // VmVyaVNpZ24gVHJ1c3QgTmV0d29yazE7MDkGA1UECxMy
// SIG // VGVybXMgb2YgdXNlIGF0IGh0dHBzOi8vd3d3LnZlcmlz
// SIG // aWduLmNvbS9ycGEgKGMpMTAxLjAsBgNVBAMTJVZlcmlT
// SIG // aWduIENsYXNzIDMgQ29kZSBTaWduaW5nIDIwMTAgQ0Ew
// SIG // ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQD1
// SIG // I0tepdeKuzLp1Ff37+THJn6tGZj+qJ19lPY2axDXdYEw
// SIG // fwRof8srdR7NHQiM32mUpzejnHuA4Jnh7jdNX847FO6G
// SIG // 1ND1JzW8JQs4p4xjnRejCKWrsPvNamKCTNUh2hvZ8eOE
// SIG // O4oqT4VbkAFPyad2EH8nA3y+rn59wd35BbwbSJxp58Ck
// SIG // PDxBAD7fluXF5JRx1lUBxwAmSkA8taEmqQynbYCOkCV7
// SIG // z78/HOsvlvrlh3fGtVayejtUMFMb32I0/x7R9FqTKIXl
// SIG // TBdOflv9pJOZf9/N76R17+8V9kfn+Bly2C40Gqa0p0x+
// SIG // vbtPDD1X8TDWpjaO1oB21xkupc1+NC2JAgMBAAGjggH+
// SIG // MIIB+jASBgNVHRMBAf8ECDAGAQH/AgEAMHAGA1UdIARp
// SIG // MGcwZQYLYIZIAYb4RQEHFwMwVjAoBggrBgEFBQcCARYc
// SIG // aHR0cHM6Ly93d3cudmVyaXNpZ24uY29tL2NwczAqBggr
// SIG // BgEFBQcCAjAeGhxodHRwczovL3d3dy52ZXJpc2lnbi5j
// SIG // b20vcnBhMA4GA1UdDwEB/wQEAwIBBjBtBggrBgEFBQcB
// SIG // DARhMF+hXaBbMFkwVzBVFglpbWFnZS9naWYwITAfMAcG
// SIG // BSsOAwIaBBSP5dMahqyNjmvDz4Bq1EgYLHsZLjAlFiNo
// SIG // dHRwOi8vbG9nby52ZXJpc2lnbi5jb20vdnNsb2dvLmdp
// SIG // ZjA0BgNVHR8ELTArMCmgJ6AlhiNodHRwOi8vY3JsLnZl
// SIG // cmlzaWduLmNvbS9wY2EzLWc1LmNybDA0BggrBgEFBQcB
// SIG // AQQoMCYwJAYIKwYBBQUHMAGGGGh0dHA6Ly9vY3NwLnZl
// SIG // cmlzaWduLmNvbTAdBgNVHSUEFjAUBggrBgEFBQcDAgYI
// SIG // KwYBBQUHAwMwKAYDVR0RBCEwH6QdMBsxGTAXBgNVBAMT
// SIG // EFZlcmlTaWduTVBLSS0yLTgwHQYDVR0OBBYEFM+Zqep7
// SIG // JvRLyY6P1/AFJu/j0qedMB8GA1UdIwQYMBaAFH/TZafC
// SIG // 3ey78DAJ80M5+gKvMzEzMA0GCSqGSIb3DQEBBQUAA4IB
// SIG // AQBWIuY0pMRhy0i5Aa1WqGQP2YyRxLvMDOWteqAif99H
// SIG // OEotbNF/cRp87HCpsfBP5A8MU/oVXv50mEkkhYEmHJEU
// SIG // R7BMY4y7oTTUxkXoDYUmcwPQqYxkbdxxkuZFBWAVWVE5
// SIG // /FgUa/7UpO15awgMQXLnNyIGCb4j6T9Emh7pYZ3MsZBc
// SIG // /D3SjaxCPWU21LQ9QCiPmxDPIybMSyDLkB9djEw0yjzY
// SIG // 5TfWb6UgvTTrJtmuDefFmvehtCGRM2+G6Fi7JXx0Dlj+
// SIG // dRtjP84xfJuPG5aexVN2hFucrZH6rO2Tul3IIVPCglNj
// SIG // rxINUIcRGz1UUpaKLJw9khoImgUux5OlSJHTMYIEcjCC
// SIG // BG4CAQEwgckwgbQxCzAJBgNVBAYTAlVTMRcwFQYDVQQK
// SIG // Ew5WZXJpU2lnbiwgSW5jLjEfMB0GA1UECxMWVmVyaVNp
// SIG // Z24gVHJ1c3QgTmV0d29yazE7MDkGA1UECxMyVGVybXMg
// SIG // b2YgdXNlIGF0IGh0dHBzOi8vd3d3LnZlcmlzaWduLmNv
// SIG // bS9ycGEgKGMpMTAxLjAsBgNVBAMTJVZlcmlTaWduIENs
// SIG // YXNzIDMgQ29kZSBTaWduaW5nIDIwMTAgQ0ECEFajDppu
// SIG // q0SJiE8Q2b7y3yQwCQYFKw4DAhoFAKBwMBAGCisGAQQB
// SIG // gjcCAQwxAjAAMBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3
// SIG // AgEEMBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEV
// SIG // MCMGCSqGSIb3DQEJBDEWBBSgXb7C84fYZeprkXhhX+CL
// SIG // koFXZjANBgkqhkiG9w0BAQEFAASCAQC3AmvXYW6goLaX
// SIG // mpehZTG+FtZap7hYEqIuEiWSSGFTu2jsLNScmWAf0huV
// SIG // 3SBKWSI2hNUTIaeogc5uTZ3avzLffYAXt6VKkkn5ChU1
// SIG // tKT2QXM5W59/cSV4h8mzClsQp+apadXvD7KF+AOvRFn9
// SIG // eViBsWAeadOOXLA9rqOTnZeHCUQittSmnRv7Daz53WPH
// SIG // 2PKf902xinQ8Tbeza+myumWBHofmY7Os4rojK1LsyJd4
// SIG // 5EYoh3K9zyi1ME51fdYAuqTdeTOsfE2Ad9pUsy8jFvb/
// SIG // 7cKmumuVwMGZYd8EwD5X3W1AB76yKDTQWkpr1c9m5uz2
// SIG // gp/DAD1P8d7wPyTuLva6oYICCzCCAgcGCSqGSIb3DQEJ
// SIG // BjGCAfgwggH0AgEBMHIwXjELMAkGA1UEBhMCVVMxHTAb
// SIG // BgNVBAoTFFN5bWFudGVjIENvcnBvcmF0aW9uMTAwLgYD
// SIG // VQQDEydTeW1hbnRlYyBUaW1lIFN0YW1waW5nIFNlcnZp
// SIG // Y2VzIENBIC0gRzICEA7P9DjI/r81bgTYapgbGlAwCQYF
// SIG // Kw4DAhoFAKBdMBgGCSqGSIb3DQEJAzELBgkqhkiG9w0B
// SIG // BwEwHAYJKoZIhvcNAQkFMQ8XDTE2MDExNzAwNTM0N1ow
// SIG // IwYJKoZIhvcNAQkEMRYEFN0GtEVjlhhySDmvPcR+mFhW
// SIG // VBCAMA0GCSqGSIb3DQEBAQUABIIBAGwQtrwQocBlIaF+
// SIG // Ob4Ebg5fjeV2cVzi2XdqiwXvDsOV2cHLVN3Zeo2maOAK
// SIG // TEDzHR9c0urmZBqF4LVVW2hOGb7gZzz4bjUGUj7+IbqX
// SIG // pGi6QqqlxdzS9HdExw8YeJADAdSvqNx9p1dsNUdMgn/3
// SIG // EsOGkbO16W5l+VlLMQaQ2zaT72pgmfYeIOMFwOO3Dfg8
// SIG // cdGsbkk+z0SkFUau04qQ2nU6xxD9GjoNcGm+yh8j1BMk
// SIG // LnmYGo6ZJ0zyGKA4jbqx2aP2ZEqeckT/t9voTiywlZPu
// SIG // IW9aFEjldnUry80nfNA4+FtrxysnuWkrdyQCbCfeOVrG
// SIG // 1FDuGfrWquEY3HZEG1g=
// SIG // End signature block
