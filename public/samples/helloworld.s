// helloworld.s
// A helloworld implementation using a single puts() call.

.data
greeting: .asciz "hello world!"		// notice the lack of \n character

// include puts() 
// sends a string pointer to stdout with a trailing newline
.extern puts

.text
main:
	// push lr to stack
	push {r12, lr}
	
	// load greeting from data
	ldr r0, =greeting
	
	// branch to put string function
	bl puts
	
	// pop lr from stack
	pop {r12, lr}

	// program end
	bx lr