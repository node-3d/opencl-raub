__kernel void square_one(
	__global uint* output,
	const uint x
) {
	uint i = get_global_id(0);
	
	if (i < 1) {
		output[i] = x * x;
	}
}
