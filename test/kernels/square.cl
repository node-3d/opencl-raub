__kernel void square(
	__global float* input,
	__global float* output,
	const uint count
) {
	uint i = get_global_id(0);
	
	if (i < count) {
		output[i] = input[i] * input[i];
	}
}
