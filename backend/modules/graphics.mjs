export default function printLogo() {
    const blue = "\x1b[34m";
    const white = "\x1b[37m";
    const red = "\x1b[31m";
    const reset = "\x1b[0m";

    const logo =
        `${blue}  _______         _______                 _                ${reset}\n` +
        `${blue} |__   __|       |__   __|               | |               ${reset}\n` +
        `${blue}    | |  ___   _ __ | | _ __  __ _   ___ | | __ ___  _ __  ${reset}\n` +
        `${white}    | | / _ \\ | '__|| || '__|/ _\` | / __|| |/ // _ \\| '__| ${reset}\n` +
        `${white}    | || (_) || |   | || |  | (_| || (__ |   <|  __/| |    ${reset}\n` +
        `${red}    |_| \\___/ |_|   |_||_|   \\__,_| \\___||_|\\_\\\\___||_|    ${reset}\n` +
        "                                                          \n";
    
    const horizontalBorder = "+------------------------------------------------------------+\n";
    const date = new Date().toISOString();
    console.log(horizontalBorder);
    console.log(logo);
    console.log(`Date: ${date}, Auteur: MyEcoria`);
    console.log(horizontalBorder);
}
