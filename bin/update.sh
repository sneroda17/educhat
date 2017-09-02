#!/bin/bash

cd ${HOME}/edu-chat-frontend
git pull
npm install
pm2 restart 0

cd ${HOME}


# cd ${HOME}/edu-chat-frontend
# git pull
# echo "npm install?(Y/N)?"
# read SHOULD_NPM_INSTALL
# $Y = "Y"
# if [$SHOULD_NPM_INSTALL == "$Y"]
# then
#   npm install
# echo "Restart the app?(Y/N)"
# fi
# read SHOULD_RESTART_THE_APP
# if [$SHOULD_RESTART_THE_APP == "N"]
# then
#   pm2 restart 0
# fi
# cd ${HOME}