.text 
// program entry point
main:
	push {r12, lr}
	
main_loop:
	ldr r0, =formatstr
	ldr r1, =operand1
	ldr r2, =operator
	ldr r3, =operand2
	bl scanf
	 
	mov r0, r1	// move operand1 to first argument
	mov r1, r3	// move operand2 to second argument
	bl calc		// operator is already in third argument
	
	mov r1, r0
	ldr r0, =returnstr
	bl printf
	
	// do another calculation
	b main_loop
	
	pop {r12, lr}
	bx lr
	

// calc function is the main calculator driver
calc:
	push {r12, lr}
	
	// get operands and operator
	ldr r0, [r0]
	ldr r1, [r1]
	ldrb r2, [r2]
	
	// add (+)
	cmp r2, #43
	addeq r0, r0, r1
	beq calc_end
	
	// sub (-)
	cmp r2, #45
	subeq r0, r0, r1
	beq calc_end
	
	// div (/)
	cmp r2, #47
	bleq divide
	beq calc_end
	
	// mul (*)
	cmp r2, #42
	bleq multiply
	beq calc_end
	
calc_end:	
	pop {r12, lr}
	bx lr


// function that multiplies operands
multiply:
	push {r12, lr}
	
	ldr r0, =operrorstr
	bl printf
	
	pop {r12, lr}
	
	mvn r0, #1
	bx lr

// function that divides operands
divide:
	push {r12, lr}
	
	ldr r0, =operrorstr
	bl printf
	
	pop {r12, lr}
	
	mvn r0, #1
	bx lr



.data
operand1: .word 0
operand2: .word 0
formatstr: .asciz "%d %c %d"

.balign 4
returnstr: .asciz "= %d\ntry another\n"

.balign 4
operator: .skip 1

.balign 4
operrorstr: .asciz "operation not supported.\n"

.balign 4
errorstr: .asciz "invalid input - please try again\n"

.extern scanf
.extern printf