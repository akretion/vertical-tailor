#!/bin/bash

oldVer=$(git tag | tail -n1 | sed "s/v//g")
echo "Old version is : $oldVer"

declare -a verArray=($(echo $oldVer | tr "." " "))
if [ $1 = "major" ]
then
  verArray[0]=$(( verArray[0] + 1 ))
  echo "We major"
elif [ $1 = "minor" ]
then
  verArray[1]=$(( verArray[1] + 1 ))
  echo "We minor"
elif [ $1 = "patch" ]
then
  verArray[2]=$(( verArray[2] + 1 ))
  echo "We patch"
else
  echo "You must provide an version change type argument, major or minor or patch."
  echo "ex: ./create_new_version.sh major"
fi

if [ $# -ne 0 ] 
then
  newVer=v$(echo "${verArray[@]}" | sed "s/\s/./g")
  echo "New version is : $newVer"
  $(git tag $newVer)
  regexp=$(echo $oldVer | sed "s/v//g" | sed "s/\./\\\./g")
  newVerNoV=$(echo $newVer | sed "s/v//g")
  newPackage=$(cat package.json | sed "s/$regexp/$newVerNoV/g")
  echo $newPackage > package.json
  echo "Package.json patched"

  cwd=$(pwd)
  newVersionJs=$(cat $cwd/www/app/version.js | sed "s/$regexp/$newVerNoV/g")
  echo $newVersionJs > $cwd/www/app/version.js
  echo "version.js patched"
fi
