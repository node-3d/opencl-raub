__kernel
void square_cpy(
	__global float* input,
	__global float* output,
	uint count
) {
	uint i = get_global_id(0);
	if (i < count) {
		output[i] = input[i] * input[i];
	}
}
