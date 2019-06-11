#!/bin/bash


echo "LEAR_MUSIC_READER=$(pwd)" >> ~/.bashrc
source ~/.bashrc
LEAR_MUSIC_READER=$(pwd)

echo "alias lear_music_reader='cd $LEAR_MUSIC_READER && make dev && cd -'" >> ~/.bashrc