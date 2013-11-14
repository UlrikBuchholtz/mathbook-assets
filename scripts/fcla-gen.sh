_cwd="$PWD"
scriptdir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
basedir=`git rev-parse --show-toplevel`
configFile=".fcla-gen-config"

if [ ! -f $scriptdir/$configFile ]; then
   # there is no config file, walk user through creating it.
   echo "There is no .fcla-gen-config file. Press enter to create one."
   read
   echo "What is the path to flca2html.xsl?"
   read -p "$basedir/" fcla2html
   echo "What is the path to fcla.xml?"
   read -p "$basedir/" fclaxml
   echo "What is the average air-speed velocity of an unladen swallow?"
   sleep 2
   echo "just kidding..."
   echo "What is the path to the outputdir?"
   read -p "$basedir/" outputdir
   
   echo "pathTo_fcla2html=$fcla2html"  > $scriptdir/$configFile
   echo "pathTo_fclaxml=$fclaxml"  >> $scriptdir/$configFile
   echo "pathTo_outputdir=$outputdir"  >> $scriptdir/$configFile

   echo "Config file written to $DIR/$configFile"
   echo "If you haven't already, you may wish to add this to your .gitignore"
   echo
fi

# run the config file to get vars
fcla2html="$basedir/"`grep 'pathTo_fcla2html=' $scriptdir/$configFile | awk -F"=" '{print $2}'`
fclaxml="$basedir/"`grep 'pathTo_fclaxml=' $scriptdir/$configFile | awk -F"=" '{print $2}'`
output="$basedir/"`grep 'pathTo_outputdir=' $scriptdir/$configFile | awk -F"=" '{print $2}'`

xsltproc --stringparam volume first --stringparam outputdir $output --xinclude $fcla2html  $fclaxml

echo "Generated fcla html in $output"

