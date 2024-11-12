
> hash wala code  : create hash key of file 
> git hash-object package.json  : it create hash key 
> git hash-object -w package.json  : it create hash key and DIR also mean like 56789876545678 this is hash key so .git/objects/56/789876545678

> We have to create blob object storage in : it means 
  blob <size>\0<content>
  example : blob 12\0hello world
            echo "hello world" > test.txt    : size - 12
            git hash-object -w test.txt
            34u2942904i9024024
            
            blob 12\0hello world
 
  git hash-object <filepath>
  blob <size>\0<content>  : \0 null
  hash(blob <size>\0<content>)
  console.log(hash)
    if -w write?hash[0..2]/[hask remaning character]

     
