import osmnx as ox
import networkx as nx
import heapq
import time
import math

class GraphAlgorithms:
    def __init__(self, graph):
        self.G = graph

    @staticmethod
    def haversine_distance(lat1, lon1, lat2, lon2):
        # Radius of earth in kilometers
        R = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c * 1000 # returns meters

    def dijkstra(self, source, target, weight='length'):
        start_time = time.time()
        
        distances = {node: float('infinity') for node in self.G.nodes}
        distances[source] = 0
        
        pq = [(0, source)]
        previous_nodes = {node: None for node in self.G.nodes}
        nodes_explored = 0
        
        while pq:
            current_dist, current_node = heapq.heappop(pq)
            nodes_explored += 1
            
            if current_node == target:
                break
                
            if current_dist > distances[current_node]:
                continue
                
            for neighbor in self.G.neighbors(current_node):
                # Handle MultiDiGraph edge data
                edge_data = self.G.get_edge_data(current_node, neighbor)
                edge_weight = min([data.get(weight, float('infinity')) for data in edge_data.values()])
                
                distance = current_dist + edge_weight
                
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    previous_nodes[neighbor] = current_node
                    heapq.heappush(pq, (distance, neighbor))
                    
        end_time = time.time()
        
        # Reconstruct path
        path = []
        curr = target
        while curr is not None:
            path.append(curr)
            curr = previous_nodes[curr]
        path.reverse()
        
        if len(path) == 1 and source != target:
            path = [] # No path found
            
        return {
            'path': path,
            'distance': distances[target] if path else float('infinity'),
            'nodes_explored': nodes_explored,
            'execution_time_ms': (end_time - start_time) * 1000
        }

    def a_star(self, source, target, weight='length'):
        start_time = time.time()
        
        target_lat = self.G.nodes[target]['y']
        target_lon = self.G.nodes[target]['x']
        
        def heuristic(node):
            node_lat = self.G.nodes[node]['y']
            node_lon = self.G.nodes[node]['x']
            return self.haversine_distance(node_lat, node_lon, target_lat, target_lon)

        distances = {node: float('infinity') for node in self.G.nodes}
        distances[source] = 0
        
        f_scores = {node: float('infinity') for node in self.G.nodes}
        f_scores[source] = heuristic(source)
        
        pq = [(f_scores[source], 0, source)] # (f_score, current_dist, node)
        previous_nodes = {node: None for node in self.G.nodes}
        nodes_explored = 0
        
        while pq:
            _, current_dist, current_node = heapq.heappop(pq)
            nodes_explored += 1
            
            if current_node == target:
                break
                
            if current_dist > distances[current_node]:
                continue
                
            for neighbor in self.G.neighbors(current_node):
                edge_data = self.G.get_edge_data(current_node, neighbor)
                edge_weight = min([data.get(weight, float('infinity')) for data in edge_data.values()])
                
                tentative_g_score = current_dist + edge_weight
                
                if tentative_g_score < distances[neighbor]:
                    previous_nodes[neighbor] = current_node
                    distances[neighbor] = tentative_g_score
                    f_score = tentative_g_score + heuristic(neighbor)
                    f_scores[neighbor] = f_score
                    heapq.heappush(pq, (f_score, tentative_g_score, neighbor))
                    
        end_time = time.time()
        
        # Reconstruct path
        path = []
        curr = target
        while curr is not None:
            path.append(curr)
            curr = previous_nodes[curr]
        path.reverse()
        
        if len(path) == 1 and source != target:
            path = [] # No path found
            
        return {
            'path': path,
            'distance': distances[target] if path else float('infinity'),
            'nodes_explored': nodes_explored,
            'execution_time_ms': (end_time - start_time) * 1000
        }
