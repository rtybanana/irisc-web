// buggymess.s
// Supposedly calculates string length.
// Please help!

.data
string: .asciz "r0 == 8?"
pass: .asciz "all fixed now!"			// you're looking for this output
fail: .asciz "still broken"

.extern puts

.text
strlen:
  // push link register to stack
  push {r12, lr}

	// load first byte
	ldrb r1, [r0]
	
	// init counter
	mov r2, #0
	
	strlen_loop:
		// compare with null terminator
		cmp r1, #0
		
		// increment counter
		addne r2, r2, #1
		
		// load next byte
		ldrbne r1, [r0], #1
		
		// loop
		bne strlen_loop
	
	// move counter into return register
	mov r0, r2

	// branch back to main
	bx lr

main:	
	// load string address
	ldrb r1, =string
	
	// call strlen function
	bl strlen
	
	// check that the output is correct
	bl check_func
	
	// pop lr from stack
	pop {r12, lr}
	
	// program end
	bx lr



// checker function
// you can fix this if you like but it ain't broke 
check_func:
	push {r12, lr}
	
	cmp r0, #8
	ldreq r0, =pass
	ldrne r0, =fail
	
	bl puts
	
	pop {r12, lr}
	bx lr