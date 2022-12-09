// stackoverflow!.s
// Oh no! This recursion is unbounded. 
// A cautionary tale. Bound your recursions.

.text
recurse:
	// push argument 0 and link register to stack
	push {r12, lr}
	
	// increment argument 0 and call function
	add r0, r0, #1
	bl recurse
	
	// pop lr and argument 0 from stack and return
	pop {r12, lr}
	bx lr

main:
	// push link register to stack
	push {r12, lr}
	
	// set arguments and call function
	mov r0, #1
	bl recurse
	
	// pop link register and branch to end
	pop {r12, lr}
	bx lr