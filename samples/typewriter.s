// typewriter.s
// A simple helloworld implementation using a loop and a putchar() call.
// It prints like a typewriter!

.data
greeting: .asciz "typewriter!\nclick, clack, ding!\n"

// include putchar()
.extern putchar

.text
print:
	// push lr to stack
	push {r4, r5, r12, lr}
	
	// move address of print outside of scratch
	mov r4, r0
	
	// set strlen counter to 0
	mov r5, #0
	
	print_loop:
		// load current byte and increment index
		ldrb r0, [r4], #1
		
		// compare with null terminator
		cmp r0, #0

		// end of loop if end of string
		beq print_loop_end
		
		// put char in output
		bl putchar
		
		// increment counter
		add r2, r2, #1
		b print_loop
	
print_loop_end:
	// place string length in return register r0
	mov r0, r2
	
	// pop lr from stack
	pop {r4, r5, r12, lr}

	// branch back to main
	bx lr

main:
	// push lr to stack
	push {r12, lr}
	
	// load pointer to greeting string
	ldr r0, =greeting
	
	// calculate string length
	bl print
	
	// pop lr from stack
	pop {r12, lr}
	
	// program end
	bx lr