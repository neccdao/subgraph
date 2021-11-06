curl -OL https://github.com/LimeChain/matchstick/releases/download/0.1.1/binary-macos &&
mv binary-macos matchstick &&
chmod a+x matchstick
mv matchstick /usr/local/bin/matchstick
which matchstick
brew install postgresql