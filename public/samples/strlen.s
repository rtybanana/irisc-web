// strlen.s
// A strlen() implementation using a loop and ldrb.
// Output stored in r0.

.data
greeting: 	.asciz "hello world!"
strlen_str: .asciz "\"%s\" has %d characters"

.extern puts
.extern printf

.text
strlen:
	// load first byte
	ldrb r1, [r0]

	// initialise counter
	mov r2, #0
	
	strlen_loop:
		// compare with null terminator
		cmp r1, #0

		// increment counter if not string end
		addne r2, r2, #1

		// load next byte if not string end
		ldrbne r1, [r0, #1]!	

		// loop if not string end
		bne strlen_loop
	
	// move counter into return register
	mov r0, r2

	// branch back to main
	bx lr

main:
	// push lr to stack
	push {r12, lr}
	
	// calculate string length
	ldr r0, =greeting
	bl strlen
	
	// print strlen details
	mov r2, r0
	ldr r1, =greeting
	ldr r0, =strlen_str
	bl printf
	
	// pop lr from stack
	pop {r12, lr}
	
	// program end
	bx lr