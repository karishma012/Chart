import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const SortingVisualizer = () => {
  const chartRef = useRef(null);
  const [array, setArray] = useState(generateRandomArray());
  const [height, setHeight] = useState(200);
  const [width, setWidth] = useState(400);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    const barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: array.map((value, index) => value.toString()), // Display array values as labels
        datasets: [
          {
            label: 'Values',
            data: array,
            backgroundColor: 'rgb(168, 168, 255)', // Change the color to rgb(168, 168, 255)
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      barChart.destroy();
    };
  }, [array, height, width]);

  function generateRandomArray() {
    return Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 1);
  }

  function randomizeArray() {
    setArray(generateRandomArray());
  }

  function applySortingAlgorithm(sortingFunction) {
    sortingFunction([...array]);
  }

  function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
      let currentVal = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > currentVal) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = currentVal;
    }
    setArray(arr);
  }

  function selectionSort(arr) {
    for (let i = 0; i < arr.length; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
    setArray(arr);
  }

  function bubbleSort(arr) {
    let swapped;
    do {
      swapped = false;
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
          swapped = true;
        }
      }
    } while (swapped);
    setArray(arr);
  }

  function quickSort(arr) {
    if (arr.length <= 1) {
      return arr;
    }

    const pivot = arr[arr.length - 1];
    const left = [];
    const right = [];

    for (let i = 0; i < arr.length - 1; i++) {
      arr[i] < pivot ? left.push(arr[i]) : right.push(arr[i]);
    }

    return [...quickSort(left), pivot, ...quickSort(right)];
  }

  function mergeSort(arr) {
    if (arr.length <= 1) {
      return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return merge(mergeSort(left), mergeSort(right));
  }

  function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  }

  function shellSort(arr) {
    const n = arr.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < n; i++) {
        const temp = arr[i];
        let j;
        for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
          arr[j] = arr[j - gap];
        }
        arr[j] = temp;
      }
    }
    setArray(arr);
  }

  function changeSize() {
    let newHeight = document.getElementById('heightInput').value;
    let newWidth = document.getElementById('widthInput').value ;
  
    setHeight(newHeight);
    setWidth(newWidth);
  
    // Update the height of each bar based on the new height
    const updatedArray = array.map(value => Math.round((value * newHeight) / height));
    setArray(updatedArray);
  
    // Update the height and width input boxes with the new values
     
     
  }
  
  

  function handleHeightChange(event) {
    setHeight(parseInt(event.target.value, 10) || 200);
  }

  function handleWidthChange(event) {
    setWidth(parseInt(event.target.value, 10) || 400);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="justify-around mb-6 bg-yellow-50">
        <button onClick={randomizeArray} className="h-8 px-2 rounded-sm border border-black bg-gray-100 mt-3 mx-2">Randomize Array</button>
        <button onClick={() => applySortingAlgorithm(insertionSort)} className="h-8 px-2 rounded-sm border border-black bg-gray-100 mx-2 ">Insertion Sort</button>
        <button onClick={() => applySortingAlgorithm(selectionSort)} className="h-8 px-2 rounded-sm border border-black bg-gray-100 mx-2">Selection Sort</button>
        <button onClick={() => applySortingAlgorithm(bubbleSort)} className="h-8 px-2 rounded-sm border border-black bg-gray-100 mx-2">Bubble Sort</button>
        <button onClick={() => applySortingAlgorithm(quickSort)} className="h-8 px-2 rounded-sm border border-black bg-gray-100 mx-2">Quick Sort</button>
        <button onClick={() => applySortingAlgorithm(mergeSort)} className="h-8 px-2 rounded-sm border border-black bg-gray-100 mx-2">Merge Sort</button>
        <button onClick={() => applySortingAlgorithm(shellSort)} className="h-8 px-2 rounded-sm border border-black bg-gray-100 mx-2">Shell Sort</button>
        <button onClick={changeSize} className="h-8 px-2 rounded-sm border border-black bg-gray-100 mx-2">Change Size</button>
      </div>
      <div className="max-w-screen-md mx-auto">
        <canvas ref={chartRef} width={width} height={height} className="border border-gray-500"></canvas>
      </div>
      <div className="flex justify-center mt-4">
        <label className="mr-4">
          Height:
          <input
            id="heightInput"
            type="number"
            value={height}
            onChange={handleHeightChange}
            className="ml-2 p-2 border border-gray-500"
          />
        </label>
        <label>
          Width:
          <input
            id="widthInput"
            type="number"
            value={width}
            onChange={handleWidthChange}
            className="ml-2 p-2 border border-gray-500"
          />
        </label>
      </div>
    </div>
  );
};

export default SortingVisualizer;
