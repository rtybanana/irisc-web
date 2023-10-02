// readme.s
// This file contains a framework for a simple helloworld application written
// in ARM assembly. There are comments to explain the different concepts.


// the .data directive begins the data section of your app, this directive can be 
// used multiple times throughout the source file
.data


// this directive forces the next line to be written at a word boundary
// byte-align: 4 (align to the nearest 4-byte boundary)
.balign 4


// give your data a label, a type and an initial value
// applicable types are:
//    type        meaning                   example C/C++ equivalents
//    .byte       one byte of data          char, unsigned char
//    .word       one word of data          int, unsigned int, int32_t
//    .hword      two bytes of data         short, unsigned short, int16_t
//    .asciz      null terminated bytes     string, char[10], char*
//    .skip       empty space               int[10]

greeting: .asciz "hello world!\n"   // null terminated string


// this directive is used to indicate that a C library function will
// be used in your code - in this case printf
.extern printf


// the .text directive begins the code section of your app, this directive can be 
// used multiple times throughoutt the source file
.text


// the "main" label, if present, is where iRISC will start your application,
// otherwise it will start from the first runnable instruction
main:

   // this instruction pushes values onto the stack for retrieval later
   // 	an even number should always be pushed
   //    lr is pushed because we are branching to a function (printf)
   //    r12 is used as padding since we only really need one register saved
   push {r12, lr}
  
   // this instruction loads the address of our defined data into r0
   ldr r0, =greeting

   // this branches to the printf C library function, using r0 as the argument
   //    modifies lr to the instruction after this (line 57)
   bl printf

   // this pops the previously pushed registers back into
   //    restores lr to the original value we pushed on line 46
   pop {r12, lr}

   // set the success response code (0)
   mov r0, #0

   // we branch to the link register to return to where our application
   // was called from, since we ran this program as an executable, this 
   // will exit the program returning the response code in r0 (0)
   bx lr
