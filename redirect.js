import { resumeText } from "./game";

export function gotoLink(scene, link){
    let str = 'link ';
    if(link.name == str + (-43.8)){//abcd
        window.open("https://github.com/shamiroxs/abcd", "_blank");
    }
    else if(link.name == str + (-58.599999999999994)){//dbms
        window.open("https://github.com/MrCodeCrafter/BDW", "_blank");
    }
    else if(link.name == str + (-73.5)){//internship
        window.open("https://github.com/shamiroxs/PRODIGY_SD_01", "_blank");
    }
    else if(link.name == str + (-80.3)){//intership register
        window.open("https://prodigyinfotech.dev/apply", "_blank");
    }
    else if(link.name == str + (-67)){//lector
        window.open("https://github.com/shamiroxs/lector", "_blank");
    }
    else if(link.name == str + (-59.8)){//lector channel
        window.open("https://www.youtube.com/@lector-audiobook", "_blank");
    }
    else if(link.name == str + (-53.099999999999994)){//powerbi
        window.open("https://github.com/shamiroxs/Learning-with-Data", "_blank");
    }
    else if(link.name == str + (-38.199999999999996)){//hello 2
        //window.open("https://www.google.com", "_blank");
    }
    else if(link.name == str + (-23.4)){//hello 1
        ///window.open("https://www.google.com", "_blank");
    }
    else if(link.name == str + (-33.6)){//internship
        window.open("assets/Resume.pdf", "_blank");
        resumeText();
    }
    
}

export function openLink(logo){
    let str = 'logo ';
    if(logo.name == str + (1)){//github
        window.open("https://github.com/shamiroxs/", "_blank");
    }
    else if(logo.name == str + (2)){//linkedin
        window.open("https://www.linkedin.com/in/shamiroxs/", "_blank");
    }
    else if(logo.name == str + (3)){//whatsapp
        window.open("https://wa.me/+919544123218", "_blank");
    }
    else if(logo.name == str + (4)){//gmail
        window.open("mailto:shamirkolakkadan26@gmail.com", "_blank");
    }
}