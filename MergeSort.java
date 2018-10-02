/**
 *
 */

/**
 * @author : Andrew Scott
 *
 *         Class : Merge Sort Purpose : The purpose of this class is to
 *         implement mergesort on the order of O(nlogn)
 */
public class MergeSort {

	public String name() {
		return "mergesort";
	}

	public void sort(int[] array) {
		mergeSort(array, 0, array.length - 1);
	}

	public void mergeSort(int[] array, int left, int right) {
		if (left < right) {
			int mid = left + (right - left) / 2;
			mergeSort(array, left, mid);
			mergeSort(array, mid + 1, right);
			merge(array, left, mid, right);
		}
	}

	public void merge(int[] array, int left, int mid, int right) {
		int[] temp = new int[right + 1];

		for (int i = left; i < right + 1; i++) {
			temp[i] = array[i];
		}

		int i = left;
		int j = mid + 1;

		for (int index = left; index < right + 1; index++) {
			if (i < mid + 1 && j < right + 1) {
				if (temp[i] <= temp[j]) {
					array[index] = temp[i];
					i++;
				} else {
					array[index] = temp[j];
					j++;
				}
			} else if (i < mid + 1 && j >= right + 1) {
				array[index] = temp[i];
				i++;
			} else {
				array[index] = temp[j];
				j++;
			}
		}
	}


}
