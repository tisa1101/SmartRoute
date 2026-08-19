import itertools
import time

class TSPOptimizer:
    def __init__(self, distance_matrix, nodes):
        self.distance_matrix = distance_matrix
        self.nodes = nodes
        
    def get_distance(self, u, v):
        return self.distance_matrix.get((u, v), self.distance_matrix.get((v, u), float('inf')))

    def calculate_path_distance(self, path):
        dist = 0
        for i in range(len(path) - 1):
            dist += self.get_distance(path[i], path[i+1])
        return dist

    def nearest_neighbor(self, start_node):
        start_time = time.time()
        unvisited = set(self.nodes)
        unvisited.remove(start_node)
        
        path = [start_node]
        current_node = start_node
        
        while unvisited:
            next_node = min(unvisited, key=lambda node: self.get_distance(current_node, node))
            path.append(next_node)
            unvisited.remove(next_node)
            current_node = next_node
            
        # Return to start to complete TSP cycle
        path.append(start_node)
        
        end_time = time.time()
        return {
            'path': path,
            'distance': self.calculate_path_distance(path),
            'execution_time_ms': (end_time - start_time) * 1000
        }

    def two_opt(self, path, max_iterations=100):
        start_time = time.time()
        best_path = path[:]
        best_distance = self.calculate_path_distance(best_path)
        improvement = True
        iterations = 0
        
        while improvement and iterations < max_iterations:
            improvement = False
            for i in range(1, len(best_path) - 2):
                for j in range(i + 1, len(best_path) - 1):
                    if j - i == 1:
                        continue # changes nothing
                    
                    new_path = best_path[:]
                    new_path[i:j] = best_path[j-1:i-1:-1] # Reverse segment
                    
                    new_distance = self.calculate_path_distance(new_path)
                    
                    if new_distance < best_distance:
                        best_path = new_path
                        best_distance = new_distance
                        improvement = True
            iterations += 1
            
        end_time = time.time()
        return {
            'path': best_path,
            'distance': best_distance,
            'execution_time_ms': (end_time - start_time) * 1000,
            'iterations': iterations
        }
